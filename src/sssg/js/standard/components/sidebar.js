export default class Sidebar {
  constructor(){
    this.selector = "body > main > nav";
    
    this.wrapHeadline();
    this.initToggleButton();
    this.buildEmailAddress();
    this.buildBalloon();
  }
  
  wrapHeadline(){
    let headlineTitle = $(this.selector).find(".headline .headline-title");
    headlineTitle.dotdotdot({
      truncate: "letter",
      watch: true
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
      direction: "right",
      color: "black",
      marginTop: $(".profile-attribute").height() / 2
    });
  }
}
