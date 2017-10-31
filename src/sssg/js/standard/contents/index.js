export default class Content {
  constructor() {
    this.selector = "body > main > article";

    this.buildArticleHeader();
  }

  buildArticleHeader(){
    const $article = $(this.selector);
    const $header = $article.find(".article-header");
    const lang = $("html").attr("lang") || "ja";
    const title = $("head > meta[property='og:title']").attr("content");
    const topic = $("head > meta[property='article:section']").attr("content");
    const subtopic = $("head > meta[property='article:tag']").attr("content");
    let published_time = $("head > meta[property='article:published_time']").attr("content");
    let dtime = new Date(Date.parse(published_time));
    let time_relative = this.timeRelativeToNow(dtime);
  
    let time_absolute = dtime.toLocaleTimeString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    let header_string = `
      <div class='tags'>
        <a><span class='tag'>${topic}</span></a>
        <a><span class='tag'>${subtopic}</span></a>
      </div>
      <h1 class='article-title'>${title}</h1>
      <div class='article-date' data-balloon='${time_absolute}'>
        <i class='fa fa-clock-o'></i> ${time_relative}
      </div>
    `;

    $header.html(header_string);
    const $article_date = $header.find('.article-date');
    $article_date.balloon({
      placement: "right",
      color: "black",
      marginTop: $($article_date).height()/2,
      marginLeft: 10,
      opacity: .7
    });
  }
  
  /**
   * Get "...days ago" text relative to current date time.
   *
   * @param {Date} dtime - Absolute datetime
   * @returns {string}
   */
  timeRelativeToNow(dtime){
    let seconds = (new Date().getTime() - dtime) / 1000;
    let timeAgo = "";
  
    if(seconds < 60){
      const t = parseInt(seconds);
      timeAgo = `${t} second${t!==1?'s':''} ago`;
    }
    else if(seconds < 3600){
      const t = parseInt(seconds/60);
      timeAgo = `${t} minute${t!==1?'s':''} ago`;
    }
    else if(seconds < 86400){
      const t = parseInt(seconds/3600);
      timeAgo = `${t} hour${t!==1?'s':''} ago`;
    }
    else if(seconds < 86400*31){
      const t = parseInt(seconds/86400);
      timeAgo = `${t} day${t!==1?'s':''} ago`;
    }
    else if(seconds < 86400*31*12){
      const t = parseInt(seconds/86400/31);
      timeAgo = `${t} month${t!==1?'s':''} ago`;
    }
    else{
      const t = parseInt(seconds/86400/31/12);
      timeAgo = `${t} year${t!==1?'s':''} ago`;
    }
    
    return timeAgo;
  }
}
