import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, onSnap }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.itemsCount = container.children.length;

  this.bounding = container.getBoundingClientRect();
  this.x = container.getBoundingClientRect().x;
  this.width = container.getBoundingClientRect().width;

  this.createDots();
  this.createPrevNext();

  // this.addScrollListener();
  this.updateIntersectingItems();
  this.intersectingItems = undefined;
}

ScrollSnapr.prototype = {
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

  updateIntersectingItems: function () {
    let options = {
      root: this.container,
      threshold: 1.0,
    };

    let callback = (entries, observer) => {
      this.intersectingItems = entries.map((entry) => {
        if (entry.isIntersecting) {
          return {
            item: entry.target,
            intersectionRatio: entry.intersectionRatio,
          };
        }
      });

      console.log(this.intersectingItems);
      // this.intersectingItems = entries.reduce((entry) => {
    };

    let observer = new IntersectionObserver(callback, options);

    for (const item of this.items) {
      observer.observe(item);
    }

    document.querySelector("#logCurrentItem").addEventListener("click", () => {
      console.log(this.getCurrentItem());
    });

    // for (const [i, item] of this.items.entries()) {}

    return { todo: true };
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
