const gulp = require('gulp');
const path = require('path');

const htmlDir = path.resolve(__dirname + "/../-/contents");
const srcMiscDir = path.resolve(__dirname + "/sssg/misc");
const dstMiscDir = path.resolve(__dirname + "/../-/misc");
const listFileName = "article_list.js";
const varName = "__articles";

gulp.task("mklist", function(cb){
  return gulp.src([htmlDir + "/**/*.html"], {base: htmlDir})
    .pipe(buildArticleList(listFileName))
    .pipe(gulp.dest(srcMiscDir))
    .pipe(gulp.dest(dstMiscDir))
    ;
});


/**
 * buildArticleList
 *
 * Compile and extract meta data from article html files.
 */
const through = require('through2');
const File = require('vinyl');
const {JSDOM} = require('jsdom');
const extend = require('object-extend');

/**
 * Parse html files to extract article title, published time, section, tag etc.
 * In order for html files to be recognized as an "article",
 * the html files must have <meta property="og:type" content="article"> tag inside <head> tag.
 *
 * Also, the "article" html files must have meta properties in <head> tag as follows:
 *   [Required]
 *     <meta property="og:title" content="<value>">
 *     <meta property="article:section" content="<value>">
 *     <meta property="article:tag" content="<value>">
 *     <meta property="article:published_time" content="<value>">
 *   [Optional]
 *     <meta property="og:description" content="<value>">
 *
 * @param {string} filename - Name of output json file
 * @returns {*}
 */
function buildArticleList(filename){
  if(!filename){
    throw new Error("Error: Missing filename");
  }
  
  const json = {};
  
  function _transform(file, enc, cb){
    let regex = /^(.+)_([a-z]{2})\.html$/;
    let result = regex.exec(path.basename(file.path));
  
    if(!result || file.isNull()){
      return cb();
    }
    
    if(file.isStream()){
      this.emit("error", new Error("Stream is not supported"));
      return cb();
    }
  
    let basename = result[1];
    let lang = result[2];
    
    json[lang] = json[lang] || {};
    
    const selectors = [
      "meta[property='og:title']",
      "meta[name='description']",
      "meta[property='article:section']",
      "meta[property='article:tag']",
      "meta[property='article:published_time']",
    ].join(",");
  
    const dom = new JSDOM(file.contents);
    const metas = dom.window.document.querySelectorAll(selectors);
    
    if(!dom.window.document.querySelector("head > meta[property='og:type'][content='article']")){
      return cb();
    }
  
    const article = {};
    article.name = basename;
  
    metas.forEach(function(element){
      const property = element.getAttribute("property");
      const value = element.getAttribute("content");
      
      switch(property){
        case "og:title": article.title = value; break;
        case "article:section": article.section = value; break;
        case "article:tag": article.tag = value; break;
        case "article:published_time": article.published_time = Date.parse(value); break;
        default:
          if(element.getAttribute("name") === "description"){
            article.description = element.getAttribute("content");
          }
      }
    });
    
    const requiredAttributes = ["title", "section", "tag", "published_time"];
    const attributesFound = Object.keys(article);
    requiredAttributes.forEach(function(v, i){
      if(!attributesFound.includes(v)){
        this.emit("error", new Error(`Required meta data is missing. Article: ${article.name}, Missing property: ${v}`));
        return cb();
      }
    }.bind(this));

    article.path = "/" + path.relative(path.resolve(__dirname + "/.."), file.path);

    const section = {};
    section[article.section] = {};
    section[article.section][article.tag] = {};
    section[article.section][article.tag][article.name] = article;
    
    delete article.name;
    delete article.section;
    delete article.tag;
  
    json[lang] = extend(json[lang], section);
    return cb();
  }
  
  function _flush(cb){
    let content = JSON.stringify(json);
    content = Function(`return function $$article_list(){ return ${content}}`).apply().toString();

    const file = new File({path: filename});
    file.contents = new Buffer(content);
    
    this.push(file);
    return cb();
  }

  return through.obj(_transform, _flush);
}

