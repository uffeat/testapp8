/* 

*/

export const as_invalid = (parent, config, ...factories) => {
  return class extends parent {
    static name = "as_invalid";

    /* Styles as invalid and shows message as hard feedback. Chainable.
    NOTE
    - Does NOT render the input element invalid. 
    - Gives way to any built-in and custom event-driven validators. 
    - Useful for momentarily showing server-side validation. */
    as_invalid(message) {
      const {feedback, input} = this.__elements__;
      feedback.text = message || null;
      input.classes.if(message, "is-invalid");
      return this;
    }
  };
};
