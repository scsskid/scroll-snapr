import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, onSnap }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.itemsCount = container.children.length;

  this.createDots();
  this.createPrevNext();

  this.intersectingItems = [];

  this.controls = {
    prev: "[data-scroll-snapr-prev]",
    next: "[data-scroll-snapr-next]",
  };
}

ScrollSnapr.prototype = {
  constructor: ScrollSnapr,

  init: function () {
    window.onload = () => {
      this.initIntersectionObserver();
      this.initScrollListener();
      this.initClickListener();
    };
  },

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
    prev.dataset.scrollSnaprPrev = true;
    prev.innerHTML = arrow;
    prev.addEventListener("click", () => scrollTo(this.items[0]));

    const next = document.createElement("button");
    next.classList.add("scroll-snapr__next");
    next.dataset.scrollSnaprNext = true;
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

      // console.table(this.intersectingItems);

      document.querySelector("#logger").innerHTML = `
        <p>
          <strong>Intersecting items (${
            this.intersectingItems.length
          }):</strong>
          ${this.intersectingItems.map((item) => item.slideIndex).join(", ")}
        </p>
      `;
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

  initScrollListener: function () {
    const debouncedHandleScroll = debounce(this.handleScroll, 100);
    console.log("initScrollListener");
    this.container.addEventListener("scroll", debouncedHandleScroll);
  },

  initClickListener: function () {
    const prevButton = document.querySelector(this.controls.prev);
    const nextButton = document.querySelector(this.controls.next);

    console.log(this.container);

    prevButton.addEventListener("click", () => {
      const prevItem = this.intersectingItems.find(
        (item) => item.slideIndex === this.intersectingItems[0].slideIndex - 1
      );
      scrollTo(prevItem);
    });

    nextButton.addEventListener("click", () => {
      // console.log(this.intersectingItems);

      // Get the last intersecting item
      const lastItem =
        this.intersectingItems[this.intersectingItems.length - 1];

      console.log(lastItem);

      // Get the next item
      const nextItem = this.items[lastItem.slideIndex + 1];

      console.log(nextItem);

      // const nextItem = this.items.filter(
      //   (item) => item !== this.intersectingItems[0].target
      // )[0];

      // console.log(nextItem);

      // const nextItem = this.intersectingItems.find(
      //   (item) => item.slideIndex === this.intersectingItems[0].slideIndex + 1
      // );
      // scrollTo(nextItem);
    });

    // this.container.addEventListener("click", (e) => {
    //   console.log("click", e);

    //   const target = e.target;
    //   const currentTarget = e.currentTarget;

    //   console.log("target", target);
    //   console.log("currentTarget", currentTarget);
    //   console.dir(this);
    // });
  },

  handleScroll: function () {
    // Update prev next target
    console.log("scroll");
  },
};

function scrollTo(el) {
  el.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
}

export default ScrollSnapr;
