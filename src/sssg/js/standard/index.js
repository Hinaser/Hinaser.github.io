import "./asset";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Content from "./contents";

const main = function(){
  const header = new Header();
  const sidebar = new Sidebar();
  const content = new Content();
};

$(main);
