import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, onSnap }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.itemsCount = container.children.length;

  this.createDots();
  this.createPrevNext();

  // this.addScrollListener();
  this.initIntersectionObserver();
  this.intersectingItems = [];
}

ScrollSnapr.prototype = {
  constructor: ScrollSnapr,

  createDots: function () {
    const dots = document.createElement("div");
    dots.classList.add("scroll-snapr__dots");

    for (const [i, item] of this.items.entries()) {
      const dot = document.createElement("div");
      dot.classList.add("scroll-snapr__dot");
      dot.innerHTML = `ref #${i}`;
      dot.addEventListener("click", () => scrollTo(item));
      dots.appendChild(dot);
    }

    this.container.after(dots);
  },

  createPrevNext: function () {
    const prevNext = document.createElement("div");
    prevNext.classList.add("scroll-snapr__prev-next");

    const prev = document.createElement("button");
    prev.classList.add("scroll-snapr__prev");
    prev.innerHTML = arrow;
    prev.addEventListener("click", () => scrollTo(this.items[0]));

    const next = document.createElement("button");
    next.classList.add("scroll-snapr__next");
    next.innerHTML = arrow;

    prevNext.appendChild(prev);
    prevNext.appendChild(next);
    this.container.after(prevNext);
  },

  initIntersectionObserver: function () {
    const updateIntersectingItems = (entries, observer) => {
      entries.forEach((entry) => {
        entry.slideIndex = this.items.indexOf(entry.target);
        if (entry.isIntersecting) {
          this.intersectingItems.push(entry);
        } else {
          this.intersectingItems = this.intersectingItems.filter(
            (item) => item.target !== entry.target
          );
        }
      });

      console.table(this.intersectingItems);
    };

    const observer = new IntersectionObserver(updateIntersectingItems, {
      root: this.container,
      threshold: 1.0,
    });

    for (const item of this.items) {
      observer.observe(item);
    }

    return observer;
  },

  addScrollListener: function () {
    this.container.addEventListener("scroll", debounce(handleScroll, 500));
  },
};

function handleScroll(e) {
  console.log(e, "scroll");
}

function scrollTo(el) {
  el.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
}

export default ScrollSnapr;
