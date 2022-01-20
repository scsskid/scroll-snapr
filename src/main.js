import smoothscroll from "smoothscroll-polyfill";
import ScrollSnapr from "./scroll-snapr/scroll-snapr";

smoothscroll.polyfill();

const scroller = new ScrollSnapr({
  container: document.querySelector(".scroll-snapr"),
});

scroller.init();
