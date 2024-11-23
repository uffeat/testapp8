import { create } from "rollo/component";

/* Returns invalid-feedback element "state-bound" to an input element. */
export function ErrorFeedback(input_element, props = {}, ...children) {
  const self = create(
    "div.invalid-feedback",
    {
      attr_ariaLive: "assertive",
      $invisible: null,
      $soft: null,
      ...props,
    },
    function () {
      /* Handle soft */
      this.effects.add((data) => {
        this.css["text-secondary"] = this.$.soft
      }, "soft");
      /* Handle invisible */
      this.effects.add((data) => {
        this.css.invisible = this.$.invisible
      }, "invisible");
    },
    ...children
  );
  /* Add effects to feedback text */
  input_element.effects.add(
    (data) => {
      self.text = input_element.$.error;
    },
    ["error"]
  );
  /* Add effects to control feedback styling */
  input_element.effects.add(
    (data) => {
      self.$.soft =
        input_element.required &&
        !input_element.$.value &&
        !input_element.$.visited;
    },
    ["error", "visited"]
  );
  /* Add effects to control feedback visibility */
  input_element.effects.add(
    (data) => {
      /* TODO Make the conditional logic more concise (not critial - it works as-is) */
      if (input_element.required && !input_element.$.value) {
        self.$.invisible = false;
        return;
      }
      if (!input_element.$.visited || !input_element.$.error) {
        self.$.invisible = false;
        return;
      }
      self.$.invisible = true;
    },
    ["error", "visited", "value"]
  );

  return self;
}
