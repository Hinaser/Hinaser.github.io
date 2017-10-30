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
  
  /**
   * Wrap headline with long text by jquery.dotdotdot
   */
  wrapHeadline(){
    let headlineTitle = $(this.selector).find(".headline .headline-title");
    headlineTitle.dotdotdot({
      truncate: "letter",
      watch: true
    });
  }
  
  /**
   * Create html elements representing headline item.
   *
   * @param {string} url - Url of the article
   * @param {string} title - Title of the article
   * @param {string} description - Description of the article
   * @param {string} published_time - String for published date of the article.
   * @returns {jQuery}
   */
  createHeadlineItem(url, title, description, published_time){
    let $container = $("<div class='headline-item'>");
    $container
      .append(
        $("<div class='headline-title'>").append(
          `<a href="${url}">${title}</a>`
        )
      )
      .append(`<div class='headline-meta'>${published_time}</div>`)
    ;
    
    if(description){
      $container.attr("title", description);
    }

    return $container;
  }
  
  /**
   * Create and attach headline list to sidebar.
   * Headline data are fetched from function `$$article_list()`, which comes from
   * external <script> tag.
   * By putting the list of article into separate external <script> tag,
   * developer can freely modify headline list without hard-coding it to
   * site script file.
   */
  setHeadline(){
    const articles = $$article_list(); // This comes from external <script> tag.
    if(!articles){
      return;
    }

    const lang = $("html").attr("lang") || "ja";
    const article_tree = articles[lang];

    const active_topic = $("head > meta[property='article:section']").attr("content");
    const active_subtopic = $("head > meta[property='article:tag']").attr("content");
  
    const $topic_container = $("#topic-list").find(".tags");
    const $subtopic_container = $("#subtopic-list").find(".tags");
    const $article_container = $("#article-list").find(".headline");
    
    /**
     * Setup topic section
     */
    const topics = (list, active_topic) => {
      const $wrapper = $("<div>");
      Object.keys(list).forEach((val, index) => {
        let $topic = $(`<a><span class='tag'>${val}</span></a>`);
    
        if(val === active_topic || (!active_topic && index === 0)){
          $topic.addClass("active");
        }
  
        $wrapper.append($topic);
      });
      
      return $wrapper.children();
    };

    /**
     * Setup sub topic section
     */
    const subTopics = (list, topic, active_subtopic) => {
      const $wrapper = $("<div>");
      Object.keys(list[topic]).forEach((val, index) => {
        let $subtopic = $(`<a><span class='tag'>${val}</span></a>`);
    
        if(val === active_subtopic || (!active_subtopic && index === 0)){
          $subtopic.addClass("active");
        }
    
        $wrapper.append($subtopic);
      });
      
      return $wrapper.children();
    };

    /**
     * Setup headline area
     */
    const headlines = (list, topic, subtopic) => {
      const $wrapper = $("<div>");
      Object.keys(list[topic][subtopic]).forEach((v, index) => {
        let article = list[topic][subtopic][v];
        let article_dtime = (new Date(article.published_time))
          .toLocaleDateString(lang, {year: "numeric", month: "long", day: "numeric"});
    
        let $headline = this.createHeadlineItem(article.path, article.title, article.description, article_dtime);
        $wrapper.append($headline);
      });
      
      return $wrapper.children();
    };
  
    $topic_container.append(topics(article_tree, active_topic));
    $subtopic_container.append(subTopics(article_tree, active_topic, active_subtopic));
    $article_container.append(headlines(article_tree, active_topic, active_subtopic));
    
    $topic_container.find("a").on("click", function(e){
      e.preventDefault();
      const $this = $(this);
      const topic = $this.find("span.tag").text();
  
      $topic_container.find("a.active").removeClass("active");
      $this.addClass("active");
      
      $subtopic_container.empty();
      $subtopic_container.append(subTopics(article_tree, topic));
      
      const subtopic = $subtopic_container.find("a.active").text();
      
      $article_container.empty();
      $article_container.append(headlines(article_tree, topic, subtopic));
    });
  
    $subtopic_container.find("a").on("click", function(e){
      e.preventDefault();
      const $this = $(this);
      const topic = $topic_container.find("a.active").text();
      const subtopic = $this.find("span.tag").text();
  
      $subtopic_container.find("a.active").removeClass("active");
      $this.addClass("active");
    
      $article_container.empty();
      $article_container.append(headlines(article_tree, topic, subtopic));
    });
  }
  
  /**
   * Defines toggle button open/close behaviour
   */
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
   * Sanitize email address text.
   * Email address will be displayed in profile section,
   * but only human can see the text.
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
  
  /**
   * Balloon for detail profile.
   */
  buildBalloon(){
    $(this.selector + " [data-balloon]").balloon({
      placement: "left",
      color: "black",
      marginTop: $(".profile-attribute").height() / 2
    });
  }
  
  /**
   * Set url to corresponding page written in another language
   * to language button(anchor).
   */
  setupLangButton(){
    const $anchor = $(".language.profile-attribute a[data-lang]");
    const current_lang = $("html").attr("lang");
    const article_id = $("head > meta[name='articleID'][content]").attr("content");
    const topic = $("head > meta[property='article:section']").attr("content");
    const subtopic = $("head > meta[property='article:tag']").attr("content");

    $anchor.each(function(){
      const $this = $(this);
      const target_lang = $this.data("lang");
      try {
        const article = $$article_list()[target_lang][topic][subtopic][article_id];
        $this.attr("href", article.path);
      }
      catch(e){}
    });
  }
}
