/**
 * Auto display balloon for elements
 * @requires jQuery
 */
(function($){
  $.fn.balloon = function(opts){
    const setting = $.extend({
      "placement": "left",
      "color": undefined,
      "marginTop": 0,
      "marginLeft": 0,
      "opacity": 1
    }, opts);
    
    if(!["bottom","right","left"].includes(setting.placement)){
      throw new Error("Invalid placement.");
    }
    if(!["default","black",undefined].includes(setting.color)){
      throw new Error("Invalid color.");
    }
  
    const wrapperInitialStyle = {
      "position": "fixed",
      "opacity": 0,
      "z-index": -1,
      "transition": "opacity ease .3s"
    };
    
    let $document = $(document);
  
    this.each(function(){
      let $this = $(this);
      let $contents = $this.find(".balloon-contents");
      let content;
      
      if(!$contents || $contents.length < 1){
        if(!(content = $this.data('balloon')))
          return;
      }
      else{
        content = $contents.html();
      }
    
      const $balloon = $("<div>")
        .addClass("balloon")
        .addClass(setting.placement)
        .html(content);
      
      if(setting.color){
        $balloon.addClass(setting.color);
      }
    
      const $wrapper = $("<div>").css(wrapperInitialStyle);
    
      $wrapper.append($balloon);
      $this.append($wrapper);
      $contents.remove();
  
      let popUpStatus = 0; // 0: hidden, 1: visible
      const arrowMargin = 27; // See asset.styl. $balloon-triangle-size = 11px, $balloon-triangle-left = 16px
  
      $this.on("mouseenter", (e) => {
        let self = $this;
        let zIndex = 9999;
        
        const calcPosition = function(){
          let top,left;
  
          switch(setting.placement){
            case "bottom":
              top = self.offset().top - $document.scrollTop() + self.height() + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() - arrowMargin + setting.marginLeft;
              break;
            case "left":
              $wrapper.css({top: 0, left: 0}); // Prevent contents wrapping before calculating $wrapper.width()
              top = self.offset().top - $document.scrollTop() - arrowMargin + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() - $wrapper.width() - setting.marginLeft;
  
              let wrapper_height = $wrapper.height();
              const remain = (top + wrapper_height) - window.innerHeight;
              if(remain > 0){
                top = top - wrapper_height + arrowMargin * 2;
                $balloon.addClass("upper");
              }
              else{
                $balloon.removeClass("upper");
              }
              break;
            case "right":
              $wrapper.css({top: 0, right: 0}); // Prevent contents wrapping before calculating $wrapper.width()
              top = self.offset().top - $document.scrollTop() - arrowMargin + setting.marginTop;
              left = self.offset().left - $document.scrollLeft() + self.width() + setting.marginLeft;
              break;
          }
  
          return {top, left};
        };
        
        let position = calcPosition();
        
        $wrapper
          .css({
            "top": position.top,
            "left": position.left,
            "z-index": zIndex,
            "opacity": setting.opacity
          });
        
        popUpStatus = 1;
  
        $(window).on("scroll.balloon", (e) => {
          let position = calcPosition();
          $wrapper.css({
            top: position.top,
            left: position.left
          })
        });
  
      });
      
      $this.on("mouseleave", (e) => {
        $wrapper.css({
          "opacity": 0
        });
        
        popUpStatus = 0;
        
        $(window).off("scroll.balloon");
      });
  
      $this.on("transitionend webkitTransitionEnd oTransitionEnd", (e) => {
        if(popUpStatus === 0){
          $wrapper.css("z-index", -1);
        }
      });
      
      $wrapper.on("mouseenter", (e) => {
        e.stopPropagation();
      });
    });
    
    return this;
  };
}(jQuery));
