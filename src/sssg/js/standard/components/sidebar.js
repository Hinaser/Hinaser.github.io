export default class Sidebar {
  constructor(){
    this.selector = "body > main > nav";
    
    this.wrapHeadline();
  }
  
  wrapHeadline(){
    let headlineTitle = $(this.selector).find(".headline .headline-title");
    headlineTitle.dotdotdot({
      truncate: "letter"
    });
  }
}
