import smoothscroll from "smoothscroll-polyfill";
import ScrollSnapr from "./scroll-snapr/scroll-snapr";

// smoothscroll.polyfill();

window.scroller = new ScrollSnapr({
  container: document.querySelector(".scroll-snapr"),
  items: 2,
});

scroller.init();
