import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, items }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.visibleItems = [];
  this.invisibleItems = [];
  this.observer = null;

  this.controls = {
    prev: "[data-scroll-snapr-prev]",
    next: "[data-scroll-snapr-next]",
  };
}

ScrollSnapr.prototype = {
  constructor: ScrollSnapr,

  init: function () {
    this.createDots();
    this.createPrevNext();
    this.addListeners();
    this.createIntersectionObserver();
    this.initClickListener();
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

  /**
   * Create Prev Next navigation
   *
   * @returns
   */

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

  /**
   * Create IntersectionObserver and observe Scroll container items
   *
   * @returns IntersectionObserver
   */

  createIntersectionObserver: function () {
    const observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      root: this.container,
      threshold: 0.99,
    });

    for (const item of this.items) {
      observer.observe(item);
    }

    this.observer = observer;
    return observer;
  },

  /**
   * handler for intersection observer
   *
   * @param {object} entries
   */

  handleIntersect: function (entries) {
    entries.forEach((entry) => {
      entry.slideIndex = this.items.indexOf(entry.target);
      if (entry.isIntersecting) {
        this.invisibleItems = this.invisibleItems.filter(
          (item) => item.target !== entry.target
        );

        this.visibleItems.push(entry);
      } else {
        this.visibleItems = this.visibleItems.filter(
          (item) => item.target !== entry.target
        );

        this.invisibleItems.push(entry);
      }
    });

    this.logVisibilityToScreen();
  },

  logVisibilityToScreen() {
    document.querySelector("#logger").innerHTML = `
        <p>
          <strong>Visible items (${this.visibleItems.length}):</strong>
          ${this.visibleItems.map((item) => item.slideIndex).join(", ")}
        </p>
        <p>
          <strong>Invisible items (${this.invisibleItems.length}):</strong>
          ${this.invisibleItems.map((item) => item.slideIndex).join(", ")}
        </p>
      `;
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

    function handleNextButtonClick() {}

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
  },

  handleScroll: function () {},
};

function scrollTo(el) {
  el.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
}

export default ScrollSnapr;
