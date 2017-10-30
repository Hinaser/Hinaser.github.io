export default class Sidebar {
  constructor(){
    this.selector = "body > main > nav";
    
    this.initToggleButton();
    this.buildEmailAddress();
    this.buildBalloon();
    this.setHeadline();
    this.wrapHeadline();
    this.setupLangButton();
  }
  
  wrapHeadline(){
    let headlineTitle = $(this.selector).find(".headline .headline-title");
    headlineTitle.dotdotdot({
      truncate: "letter",
      watch: true
    });
  }

  createHeadlineItem(url, title, description, published_time){
    let $container = $("<div class='headline-item'>");
    $container
      .append(
        $("<div class='headline-title'>").append(
          `<a href="${url}" ${description ? 'title="'+description+'"':''}">${title}</a>`
        )
      )
      .append(`<div class='headline-meta'>${published_time}</div>`)
    ;

    return $container;
  }

  setHeadline(){
    const articles = $$article_list(); // Comes from external <script> tag.
    if(!articles){
      return;
    }

    const lang = $("html").attr("lang") || "ja";
    const article_tree = articles[lang];

    const active_topic = $("head > meta[property='article:section']").attr("content");
    const active_subtopic = $("head > meta[property='article:tag']").attr("content");

    const $topic_container = $("#topic-list").find(".tags");

    Object.keys(article_tree).forEach((val, index) => {
      let $topic = $(`<a><span class='tag'>${val}</span></a>`);

      if(val === active_topic || (!active_topic && index === 0)){
        $topic.addClass("active");
      }

      $topic_container.append($topic);
    });

    if(!article_tree[active_topic]){
      return;
    }

    const $subtopic_container = $("#subtopic-list").find(".tags");

    Object.keys(article_tree[active_topic]).forEach((val, index) => {
      let $subtopic = $(`<a><span class='tag'>${val}</span></a>`);

      if(val === active_subtopic || (!active_subtopic && index === 0)){
        $subtopic.addClass("active");
      }

      $subtopic_container.append($subtopic);
    });

    if(!article_tree[active_topic][active_subtopic]){
      return;
    }

    const $article_container = $("#article-list").find(".headline");

    Object.keys(article_tree[active_topic][active_subtopic]).forEach((v, index) => {
      let article = article_tree[active_topic][active_subtopic][v];
      let article_dtime = (new Date(article.published_time))
        .toLocaleDateString(lang, {year: "numeric", month: "long", day: "numeric"});

      let $headline = this.createHeadlineItem("#", article.title, article.description, article_dtime);
      $article_container.append($headline);
    });
  }
  
  initToggleButton(){
    let $document = $(document);
    let $sidebar = $(this.selector);
    let $tags = $sidebar.find(".tags");
    let $button = $("#sidebar-toggle-button");
    
    const closeSidebar = (e) => {
      // Do nothing if outside of sidebar has been clicked.
      // However, if screen size is for mobile, close sidebar wherever is clicked.
      if(!window.matchMedia("(max-width: 799px)").matches &&
        $sidebar.is(e.target) || $sidebar.has(e.target).length > 0){
        return;
      }
  
      $sidebar.removeClass("visible");
    };
    
    const onToggleButtonClicked = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if($sidebar.hasClass("visible")){
        $sidebar.removeClass("visible");
        $document.off("click.closeSidebar");
      }
      else{
        $sidebar.addClass("visible");
        $document.on("click.closeSidebar", closeSidebar);
      }
    };
  
    $button.on("click", onToggleButtonClicked);
  }
  
  /**
   * Preventing email spam
   */
  buildEmailAddress(){
    let pageOpened = new Date().getTime();
    let isAlreadyBuilt = false;
    let $email = $(".profile .social .email");
    
    const addr = [8059, 6088, 7163, 5063, 7384, -2821, 5879, 6088, 7163, 4472, 8288, 5264, -3088, 5672, 6088, 8519, 5879, 8752, 4667, 7607, 4472, 5672, 5264, 8288, -841, 5672, 6944, 4472, 6088, 6727, -2821, 4864, 7384, 6944];
    
    const makeAddress = (e) => {
      if(isAlreadyBuilt && (new Date().getTime() - pageOpened) > 1500) return;
      
      $email.attr("href", "mailto:" + addr.map(function(v){
        return String.fromCharCode(Math.sqrt(v+4937))
      }).join(""));
    };
    
    $email.on("mouseover touchstart", makeAddress);
  }
  
  buildBalloon(){
    $(this.selector + " [data-balloon]").balloon({
      placement: "left",
      color: "black",
      marginTop: $(".profile-attribute").height() / 2
    });
  }

  setupLangButton(){
    const $anker = $(".language.profile-attribute a[data-lang]");
    const current_lang = $("html").attr("lang");
    const article_id = $("head > meta[name='articleID'][content]").attr("content");
    const topic = $("head > meta[property='article:section']").attr("content");
    const subtopic = $("head > meta[property='article:tag']").attr("content");
    let article = $$article_list()[current_lang][topic][subtopic][article_id];
    let basedir = /^(.+)[/]([^/]*)$/.exec(article.path)[1];

    $anker.each(function(){
      const $this = $(this);
      const target_lang = $this.data("lang");
      $this.attr("href", `/${basedir}/${article_id}_${target_lang}.html`);
    });
  }
}
