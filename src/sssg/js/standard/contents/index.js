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
    
    published_time = Date.parse(published_time);
    let time_elapsed = (new Date().getTime() - published_time) / 1000;
    
    if(time_elapsed < 60){
      const t = parseInt(time_elapsed);
      time_elapsed = `${t} second${t!==1?'s':''} ago`;
    }
    else if(time_elapsed < 3600){
      const t = parseInt(time_elapsed/60);
      time_elapsed = `${t} minute${t!==1?'s':''} ago`;
    }
    else if(time_elapsed < 86400){
      const t = parseInt(time_elapsed/3600);
      time_elapsed = `${t} hour${t!==1?'s':''} ago`;
    }
    else if(time_elapsed < 86400*31){
      const t = parseInt(time_elapsed/86400);
      time_elapsed = `${t} day${t!==1?'s':''} ago`;
    }
    else if(time_elapsed < 86400*31*12){
      const t = parseInt(time_elapsed/86400/31);
      time_elapsed = `${t} month${t!==1?'s':''} ago`;
    }
    else{
      const t = parseInt(time_elapsed/86400/31/12);
      time_elapsed = `${t} year${t!==1?'s':''} ago`;
    }

    published_time = (new Date(published_time))
      .toLocaleTimeString(lang, {
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
      <div class='article-date' data-balloon='${published_time}'>
        <i class='fa fa-clock-o'></i> ${time_elapsed}
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
}
