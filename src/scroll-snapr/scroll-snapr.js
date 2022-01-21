import arrow from "./arrow.svg";
// import { debounce } from "./helpers/throttle-debounce";
import { debounce } from "lodash";

function ScrollSnapr({ container, items }) {
  this.container = container;
  this.items = Array.from(container.children);
  this.visibleItems = [];
  this.invisibleItems = [];

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
    const handleIntersect = (entries) => {
      // push
      console.log(`handleIntersect`);

      entries.forEach((entry) => {
        entry.slideIndex = this.items.indexOf(entry.target);
        if (entry.isIntersecting) {
          this.visibleItems.push(entry);
        } else {
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
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: this.container,
      threshold: 1.0,
    });

    for (const item of this.items) {
      observer.observe(item);
    }

    return this.visibleItems;
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
      console.dir(this.items);
      console.log(this.visibleItems);

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

      console.log(invisibleitems);
    }

    // Debugging
    // -----------------------------------------------
    // Log This visible button

    document.querySelector("#logVisible").addEventListener("click", () => {
      console.table(this.visibleItems);
    });
  },

  initScrollListener: function () {
    const debouncedHandleScroll = debounce(this.handleScroll, 500);
    this.container.addEventListener("scroll", debouncedHandleScroll.bind(this));
  },

  handleScroll: function () {
    // Update prev next target
    // console.log("scroll");

    // auch push to array

    this.invisibleItems = this.items.filter((item, i) => {
      // console.log(this.visibleItems);
      const itemIsVisible = typeof this.visibleItems[i] !== "undefined";

      console.log(`${i} is visible: ${itemIsVisible}`);
      // return !itemIsVisible;

      if (this.visibleItems[i] && item === this.visibleItems[i].target) {
        console.log(item);
        console.log(this.visibleItems[i].target);
        console.log(`found ${i} in visibleItems`);
        return false;
      }

      return true;
    });

    console.log(this.items);
    console.log(this.visibleItems);
    console.log(this.invisibleItems);
  },
};

function scrollTo(el) {
  el.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
}

export default ScrollSnapr;
