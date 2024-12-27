/* Implements condition getter/setter. */
export const condition = (parent, config, ...factories) => {
  return class condition extends parent {
    /* Returns condition. */
    get condition() {
      return this.#condition;
    }
    /* Sets condition. */
    set condition(condition) {
      this.#condition = condition;
    }
    #condition;
  };
};

/* Creates and returns condition function from short-hand. */
function interpret_condition(condition) {
  /* Create condition function from string short-hand */
  if (typeof condition === "string") {
    const TYPEOF = 'typeof '
    if (condition.startsWith(TYPEOF)) {
      const type = condition.slice(TYPEOF.length)
      return ([k, v]) => typeof v === type;
      
    }


    /* . */
    return ([k, v]) => condition == k;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({ current }) => {
      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */
    const key = Object.keys(condition)[0];
    const value = Object.values(condition)[0];
    return ({ current }) => current[key] === value;
  }

  throw new Error(`Invalid condition: ${condition}`);
}