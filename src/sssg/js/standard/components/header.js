export default class Header {
  constructor(){
    this.selector = "body > header";
    this.element = $(this.selector);
    
    this.sticky();
  }
  
  sticky(){
    let scrollDownThreshold = 200;
    let scrollUpThreshold = 100;
    let mediaQueryString = "(min-width: 1200px), (min-width: 800px) and (max-width: 1199px)";
    
    let $window = $(window);
    let header = this.element;
    let resizing = false;
  
    const onTransitionEnd = (e) => {
      header.removeClass("disable-height-animation");
      resizing = false;
    };
  
    header.on("transitionend webkitTransitionEnd oTransitionEnd", onTransitionEnd);
  
    $window.on("scroll", (e) => {
      if(!window.matchMedia(mediaQueryString).matches || resizing) return;
    
      const scrollTop = $window.scrollTop();
    
      if(scrollUpThreshold < scrollTop && scrollTop < scrollDownThreshold){
        if(!header.hasClass("fixed-header")) return;
      
        if(!header.hasClass("scroll-margin")) header.addClass("scroll-margin");
      
        let header_height = 300 + 20 - scrollTop;
        header.css({
          height: header_height,
          bottom: `calc(100% - ${header_height}px)`
        });
        
        return;
      }
    
      if(scrollTop >= scrollDownThreshold){
        if(header.hasClass("fixed-header")) return;
      
        resizing = true;
        header.addClass("fixed-header");
      }
      else if(scrollTop <= scrollUpThreshold){
        if(!header.hasClass("fixed-header")) return;
      
        header.removeAttr("style");
        header.removeClass("scroll-margin");
      
        resizing = true;
        header.addClass("disable-height-animation");
        header.removeClass("fixed-header");
      }
    });
  }
}

