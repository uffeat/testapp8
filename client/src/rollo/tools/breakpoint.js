import { Reactive } from "@/rollo/reactive/value.js";
import { first } from "@/rollotools/object/first.js";

/* Breakpoints as per Bootstrap 5.2 
NOTE
- Config for 'breakpoint' and 'range'.  */
const breakpoints = [
  { xs: 0 },
  { sm: 576 },
  { md: 768 },
  { lg: 992 },
  { xl: 1200 },
  { xxl: 1400 },
];

/* Watches breakpoints reactively.
NOTE
- Each 'range' prop is a reactive Boolean state that watches, if document 
  width satisfies the range.  
- "Range logic" follows a typical reactive CSS setup, e.g., the 'lg' state is 
  always true, when the 'sm' state is true; but the opposite may or may not 
  be the case. */
export const breakpoint = new (class Breakpoint {
  constructor() {
    breakpoints.forEach((item) => {
      const [name, breakpoint] = first(item);
      /* Create state prop */
      const state = Reactive(null, { owner: this, name });
      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: false,
        get: () => state,
      });
      const query = window.matchMedia(`(width >= ${breakpoint}px)`);
      /* Set initial value */
      state.update(query.matches);
      /* Make sure that state updates dynamically */
      query.addEventListener("change", (event) => state.update(event.matches));
    });
  }
})();

/* Watches breakpoint range reactively.
NOTE
- State updates dynamically as per breakpoints. 
- State value assumes an integer as per breakpoints. */
export const range = new (class Range {
  #names = breakpoints.map((item) => first(item)[0]);
  #state = Reactive(null, { owner: this });

  constructor() {
    breakpoints.forEach((item, index) => {
      const current = first(item)[1];
      /* Construct media query */
      const media = (() => {
        if (index === 0) {
          const next = first(breakpoints[1])[1];
          return `(width < ${next}px)`;
        }
        if (index === breakpoints.length - 1) {
          return `(${current}px <= width)`;
        }
        const next = first(breakpoints[index + 1])[1];
        return `(${current}px <= width < ${next}px)`;
      })();
      const query = window.matchMedia(media);
      /* Set initial state */
      if (query.matches) {
        this.#state.update(index);
      }
      /* Make sure that state updates dynamically */
      query.addEventListener("change", (event) => {
        if (event.matches) {
          this.#state.update(index);
        }
      });
    });
  }

  /* Returns current state value. */
  get current() {
    return this.#state.current;
  }

  /* Returns state effects controller. */
  get effects() {
    return this.#state.effects;
  }

  /* Returns previous state value. */
  get previous() {
    return this.#state.previous;
  }

  /* Returns breakpoint range name by index. */
  name(index) {
    return this.#names.at(index);
  }
})();

/* Returns document width. */
export const width = () => document.documentElement.clientWidth;


/* EXAMPLES

import { breakpoint, range } from "rollo/tools/breakpoint";

breakpoint.sm.effects.add(
  ({ current }) => {
    console.log("sm current:", current);
  },
  true
);

range.effects.add(
  ({ current, owner }) => {
    console.log("Range index:", current);
    console.log("Range name:", owner.owner.name(current));
  },
  true
);

*/
