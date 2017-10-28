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

    published_time = (new Date(Date.parse(published_time)))
      .toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

    let header_string = `
      <div class='tags'>
        <a><span class='tag'>${topic}</span>
        <a><span class='tag'>${subtopic}</span>
      </div>
      <h1 class='article-title'>${title}</h1>
      <div class='article_date'>
      <i class='fa fa-clock-o'></i> ${published_time}</div>
    `;

    $header.html(header_string);
  }
}
