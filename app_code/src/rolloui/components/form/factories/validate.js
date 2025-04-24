/* 

*/

export const validate = (parent, config, ...factories) => {
  return class extends parent {
    static name = "validate";

    /* Performs validation, incl. feedback and styling. Fires custom validity 
    event. Returns valid flag.
    NOTE
    - Does not (necessarily) rely on native validation for actual validation.
    - Uses native validation mechanisms, so that an invalid value does fire
      invalid event and obeys CSS validation-related pseudo-selectors.
    - Does not use multiple native validity states, only customError. In this way,
      the input element is either valid or invalid by custom error. This 
      takes out the guesswork re which validation message to report. 
    - Does (intentionally) not show positive validation styling. */
    validate() {
      const { feedback, input } = this.__elements__;
      /* Clear any 'as_invalid' styling */
      input.classes.remove("is-invalid");
      /* Sync value state to attribute */
      this.attribute.value = this.value ? true : null; // TODO: Consider if redundant?
      /* Determine invalid */
      const invalid = (() => {
        let result = false;
        if (this.value === null) {
          /* value is null; 'required' is the only relevant validator. */
          if (this.required) {
            result = "Required";
          }
        } else {
          /* NOTE validators only run, if value is non-null */
          if (this.validators) {
            result = this.validators.validate();
          }
        }
        this.attribute.invalid = result;
        return result;
      })();
      /* Use invalid */
      if (invalid) {
        /* Is invalid */
        input.title = invalid;
        /* NOTE Likely redundant to set custom validity for native 'required' 
        validation, but does no harm. */
        input.setCustomValidity(invalid);
        feedback.text = invalid;
        if (this.visited) {
          /* Visited -> allow show of validation styling */
          this.classes.add("was-validated");
        } else {
          /* Not visited -> prevent show of validation styling */
          this.classes.remove("was-validated");
        }
      } else {
        /* Is valid */
        input.attribute.title = null;
        input.setCustomValidity("");
        feedback.text = null;
        /* Valid -> prevent show of positiv validation styling */
        this.classes.remove("was-validated");
      }
      this.send("validity", { detail: invalid });
      return input.checkValidity();
    }
  };
};
