export default class Sidebar {
  constructor(){
    this.selector = "body > main > nav";
    
    this.wrapHeadline();
    this.initToggleButton();
  }
  
  wrapHeadline(){
    let headlineTitle = $(this.selector).find(".headline .headline-title");
    headlineTitle.dotdotdot({
      truncate: "letter"
    });
  }
  
  initToggleButton(){
    let $document = $(document);
    let $sidebar = $(this.selector);
    let $button = $("#sidebar-toggle-button");
    
    const closeSidebar = (e) => {
      // Do nothing if outside of sidebar has been clicked
      if($sidebar.is(e.target) || $sidebar.has(e.target).length > 0){
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
}
