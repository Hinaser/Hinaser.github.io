export default class Header {
  constructor(){
    this.selector = "body > header";
    this.element = $(this.selector);
    
    let $window = $(window);
    let resizing = false;
    
    $window.on("scroll", (e) => {
      if($window.scrollTop() > 100 && window.matchMedia("(min-width: 1200px)").matches){
        resizing = true;
        this.element.addClass("fixed-header");
        this.element.one("transitionend webkitTransitionEnd oTransitionEnd", ()=>{
          resizing = false;
          console.log(resizing);
        });
      }
      else if(!resizing){
        this.element.removeClass("fixed-header");
      }
    })
  }
}

