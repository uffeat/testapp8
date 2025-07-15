/*
const input = await use("@/components/form/mixins/input.js");
import input from "@/components/form/mixins/input.js";
20250621
v.1.0
*/
import { Ref, State } from "@/rollostate/__init__.js";
import { is_number } from "@/rollotools/is/is_number.js";
import { is_numeric } from "@/rollotools/is/is_numeric.js";
import { create_id } from "@/components/form/tools/id.js";

export default (parent, config) => {
  return class extends parent {
    #_ = {
      numchars: ["", "-", ".", ","],
      states: {},
    };

    constructor() {
      super();
      /* State slice to manage "message" and "visited"
        NOTE Using 'State', since combined-value effect is required. */
      this.#_.states.main = new State({
        name: "main",
        owner: this,
      }).effects
        .add(
          (change, { state }) => {
            /* Set message attribute */
            this.attribute.message = change.message;
            /* Send message event */
            this.send("message", { bubbles: true, detail: change.message });
          },
          ["message"]
        )
        .effects.add(
          /* Set visited attribute */
          (change, { state }) => {
            this.attribute.visited = change.visited;
          },
          ["visited"]
        )
        .effects.add(
          /* Set style */
          (change, { state }) => {
            this.classes.if(state.$.visited && state.$.message, "is-invalid");
          },
          ["message", "visited"]
        );

      /* State slice to manage "value".
        NOTE Separate slice, since updates "message" */
      this.#_.states.value = new Ref({
        name: "value",
        owner: this,
      }).effects
        .add((current, { ref }) => {
          /* Value check and correct */
          if (this.type === "numeric") {
            if (current !== null && !is_number(current)) {
              console.error("value:", current);
              throw new Error(`Not a number.`);
            }
          } else {
            if (typeof current === "string") {
              current = current.trim();
            }
            ref.update(current === "" ? null : current, { silent: true });
          }
        })
        .effects.add((current, { ref }) => {
          /* Update UI */
          super.value = current;
        })
        .effects.add((current, { ref }) => {
          /* Update empty attribute */
          this.attribute.empty = !current;
        })
        .effects.add((current, { ref }) => {
          this.validate();
        });
      Object.freeze(this.#_.states);

      this.update({
        id: create_id(),
        '[rollo': true,
        /* Prevent browser default validation message */
        title: " ",
        ".form-control": true,
        /* Set visisted on blur */
        "@blur$once": (event) => {
          this.states.main.$.visited = true;
        },
      });

      if (this.tagName === 'INPUT') {
        this.on.input = (event) => {
        if (this.type === "numeric") {
          if (!is_numeric(super.value)) {
            /* Self-correct numeric input */
            super.value = super.value.slice(0, -1);
          }
        }
      };
      }

      

      this.on.input = (event) => {
        if (this.type === "numeric") {
          /* Update state */
          this.states.value.$ = this.#_.numchars.includes(super.value)
            ? null
            : Number(super.value.replace(",", "."));
        } else {
          /* Update state */
          const value = super.value.trim();
          this.states.value.$ = value === "" ? null : value;
        }
      };
    }

    __new__() {
      super.__new__?.();
    }

    /* Return state controllers.
      NOTE Fully exposed; useful for wireing up complex components.
      Exposure could have been limited, but hard encapsulation is already 
      not achievable due to the option for direct DOM manipulation etc. */
    get states() {
      return this.#_.states;
    }

    /* Returns max constraint. */
    get max() {
      return this.#_.max;
    }

    /* Sets max constraint. */
    set max(max) {
      this.#_.max = max;
    }

    /* Returns min constraint. */
    get min() {
      return this.#_.min;
    }

    /* Sets min constraint. */
    set min(min) {
      this.#_.min = min;
    }

    /* Returns valid state. */
    get valid() {
      return !!this.attribute.message;
    }

    /* Returns custom validators. */
    get validators() {
      return this.#_.validators;
    }

    /* Sets custom validators. */
    set validators(validators) {
      if (validators) {
        validators = Object.freeze([...validators]);
      }
      this.#_.validators = validators;
    }

    /* Returns value state. */
    get value() {
      return this.states.value.$;
    }

    /* Sets value state. */
    set value(value) {
      this.states.value.$ = value;
    }

    /* Validates, updates message and returns valid state */
    validate() {
      this.setCustomValidity("");
      const pipe = [];
      /* required */
      if (this.required) {
        pipe.push((value) => {
          if (value === null) return "Required";
        });
      }
      /* email and url */
      if (["email", "url"].includes(this.type)) {
        pipe.push(() => {
          if (this.validity.typeMismatch) return "Invalid format";
        });
      }
      /* pattern */
      if (this.pattern) {
        pipe.push(() => {
          if (this.validity.patternMismatch) return "Invalid format";
        });
      }
      /* min */
      if (this.min !== undefined) {
        if (this.type === "numeric") {
          pipe.push((value) => {
            if (value < this.min) {
              this.setCustomValidity(" ");
              return "Too low";
            }
          });
        } else {
          pipe.push((value) => {
            if (value.length < this.min) {
              this.setCustomValidity(" ");
              return "Too short";
            }
          });
        }
      }
      /* max */
      if (this.max !== undefined) {
        if (this.type === "numeric") {
          pipe.push((value) => {
            if (value > this.max) {
              this.setCustomValidity(" ");
              return "Too high";
            }
          });
        } else {
          pipe.push((value) => {
            if (value.length > this.max) {
              this.setCustomValidity(" ");
              return "Too long";
            }
          });
        }
      }
      /* custom */
      if (this.validators) {
        this.validators.forEach((validator) => {
          pipe.push((value) => {
            const message = validator(value);
            if (message) {
              this.setCustomValidity(" ");
              return message;
            }
          });
        });
      }

      this.states.main.$.message =
        (() => {
          for (const validator of pipe) {
            const message = validator(this.value);
            if (message) return message;
          }
        })() || null;

      return this.checkValidity();
    }

    __init__() {
      super.__init__?.();

      if (this.value === undefined) {
        this.value = null;
      }
    }
  };
};
