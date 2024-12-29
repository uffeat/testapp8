/* Controller for source function.
Features:
- 'call' method for calling 'source'.
- Ensures that source always recieves a single Change instance argument.
- 'disabled' property to control prevention of source call.
- Option to define condition for source call, incl. definition from short-hands.
- General-purpose 'tag' property for additional data.
*/
export class Callable {
  static create = (...args) => new Callable(...args);

  constructor({ condition, transform, owner, source, tag } = {}) {
    this.condition = condition;
    this.#owner = owner;
    this.source = source;
    this.tag = tag;
    this.transform = transform;
  }

  /* Returns condition. */
  get condition() {
    return this.#condition;
  }
  /* Sets condition. 
  NOTE
  - 'condition' can be changed dynamically.
    While this can be powerful, it can also add complexity!
  */
  set condition(condition) {
    this.#condition = condition;
  }
  #condition;

  /* Returns transform. */
  get transform() {
    return this.#transform;
  }
  /* Sets transform. 
  NOTE
  - 'transform' can be changed dynamically.
    While this can be powerful, it can also add complexity!
  */
  set transform(transform) {
    this.#transform = transform;
  }
  #transform;

  /* Returns disabled state. */
  get disabled() {
    return this.#disabled;
  }
  /* Sets disabled state.
  NOTE
  - Turns the effect on/off (regardless of condition).
  */
  set disabled(disabled) {
    this.#disabled = disabled;
  }
  #disabled;

  /* Returns name */
  get name() {
    if (this.source) {
      return this.source.name;
    }
  }

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  /* Sets source. 
  NOTE
  - 'source' can be changed dynamically.
    While this can be powerful, it can also add complexity!
  */
  set source(source) {
    this.#source = source;
  }
  #source;

  /* Returns tag. */
  get tag() {
    return this.#tag;
  }
  /* Sets tag. 
  NOTE
  - General purpose property for providing additional information */
  set tag(tag) {
    this.#tag = tag;
  }
  #tag;

  /* Calls source and return result. */
  call(context, ...args) {
    /* By convention, true context set context to self */
    if (context === true) {
      context = this
    }
    /* Check disabled */
    if (this.disabled) {
      return;
    }
    /* Check source */
    if (!this.source) {
      return;
    }
    /* Transform args */
    if (this.transform) {
      args = this.transform(...args);
      if (!Array.isArray(args)) {
        args = [args];
      }
    }
    /* Check condition */
    if (this.condition) {
      if (
        !(context
          ? this.condition.call(context, ...args)
          : this.condition(...args))
      ) {
        return;
      }
    }
    /* Call source and return result */
    return context ? this.source.call(context, ...args) : this.source(...args);
  }

  
}
