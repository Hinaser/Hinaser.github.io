(function(window, document){
  if(window.System){
    throw new Error("Unknown System module is already loaded");
  }
  
  var parser = document.createElement("a");
  var scripts = document.querySelectorAll("script[src]");
  var resourceRoot;
  
  scripts.forEach(function(s){
    parser.href = s.getAttribute("src");
    var path = parser.pathname.split("/");
    if(path.slice(-1)[0] === "System.config.js"){
      resourceRoot = path.slice(0, path.length - 2).join("/");
      resourceRoot = window.location.protocol
        + "//" + window.location.hostname
        + ":" + window.location.port
        + resourceRoot;
    }
  });
  
  if(!resourceRoot){
    throw new Error("Resource root could not be found");
  }
  
  window.System = {};
  window.System.config = {
    resourceRoot: resourceRoot,
    articleList: resourceRoot + "/misc/menulist.json"
  };
})(this, this.document);