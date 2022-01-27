import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, items }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.visibleItems = [];
  this.invisibleItems = [];
  this.observer = null;

  this.createDots();
  this.createPrevNext();

  this.controls = {
    prev: "[data-scroll-snapr-prev]",
    next: "[data-scroll-snapr-next]",
  };
}

ScrollSnapr.prototype = {
  constructor: ScrollSnapr,

  init: function () {
    window.onload = () => {
      // this.initScrollListener();
      this.addListeners();
      this.createIntersectionObserver();
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

  createIntersectionObserver: function () {
    this.observer = new IntersectionObserver(handleIntersect.bind(this), {
      root: this.container,
      threshold: 0.99,
    });

    for (const item of this.items) {
      this.observer.observe(item);
    }

    // Observer Handler
    function handleIntersect(entries) {
      entries.forEach((entry) => {
        entry.slideIndex = this.items.indexOf(entry.target);
        if (entry.isIntersecting) {
          console.log(
            `entry is intersecting:`,
            entry.target,
            entry.intersectionRatio
          );
          this.visibleItems.push(entry);
        } else {
          console.log(
            `entry isnt intersecting anymore:`,
            entry.target,
            entry.intersectionRatio
          );
          this.visibleItems = this.visibleItems.filter(
            (item) => item.target !== entry.target
          );
        }
      });

      // console.table(this.visibleItems);

      document.querySelector("#logger").innerHTML = `
        <p>
          <strong>Visible items (${this.visibleItems.length}):</strong>
          ${this.visibleItems.map((item) => item.slideIndex).join(", ")}
        </p>
      `;
    }

    // Instanciate Observer

    return this.observer;
  },

  initClickListener: function () {
    const prevButton = document.querySelector(this.controls.prev);
    const nextButton = document.querySelector(this.controls.next);

    const firstItem = this.visibleItems[0];
    const lastItem = this.visibleItems[this.visibleItems.length - 1];

    // const previousItem = this.items[firstItem.slideIndex - 1];
    // const nextItem = this.items[lastItem.slideIndex + 1];

    prevButton.addEventListener("click", () => {});

    nextButton.addEventListener("click", handleNextButtonClick.bind(this));

    function handleNextButtonClick() {
      // console.dir(this.items);
      // console.log(this.visibleItems);

      // get invisible Items

      const invisibleitems = this.items.filter((item, i) => {
        const itemIsVisible = typeof this.visibleItems[i] !== "undefined";

        // console.log(`${i} is visible: ${itemIsVisible}`);
        if (this.visibleItems[i] && item === this.visibleItems[i].target) {
          console.log(item);
          console.log(this.visibleItems[i].target);
          console.log(`found ${i} in visibleItems`);
          return false;
        }

        return true;
      });

      // console.log(invisibleitems);
    }

    // Debugging
    // -----------------------------------------------
    // Log This visible button

    document.querySelector("#logVisible").addEventListener("click", () => {
      console.table(this.visibleItems);
    });
  },

  addListeners: function () {
    this.container.addEventListener(
      "scroll",
      debounce(this.handleScroll, 500).bind(this)
    );

    this.container.addEventListener("scrollEnd", (e) => {
      // console.log(`handle scrollEnd Event`, e);
      // console.table(this.visibleItems);
    });
  },

  // addListeners: function () {
  //   // this.container.emitEvent(createIntersectingEvent({ detail: this.vis }));
  //   this.container.addEventListener("scrollEnd", (e) => {
  //     console.log();
  //   });
  // },

  handleScroll: function () {
    // Dispatch "scrollEnd"

    const scrollEndEvent = new CustomEvent("scrollEnd", {
      visibleItems: this.visibleItems,
    });

    this.container.dispatchEvent(scrollEndEvent);
  },

  OFFhandleScroll: function () {
    // Update prev next target
    // console.log("scroll");

    // auch push to array

    console.log("scroll");

    this.invisibleItems = this.items.filter((item, i) => {
      // console.log(this.visibleItems);
      const itemIsVisible = typeof this.visibleItems[i] !== "undefined";

      // console.log(`${i} is visible: ${itemIsVisible}`);
      // return !itemIsVisible;

      if (this.visibleItems[i] && item === this.visibleItems[i].target) {
        // console.log(item);
        // console.log(this.visibleItems[i].target);
        // console.log(`found ${i} in visibleItems`);
        return false;
      }

      return true;
    });

    // console.log(this.items);
    // console.log(this.visibleItems);
    // console.log(this.invisibleItems);
  },
};

function scrollTo(el) {
  el.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
}

function createIntersectingEvent({ detail }) {
  const intersectEvent = new CustomEvent("intersecting", {
    detail,
  });

  return intersectEvent;
}

export default ScrollSnapr;
