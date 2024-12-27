/* Implements reduce method. */
export const reduce = (parent, config, ...factories) => {
  return class reduce extends parent {
    /* Calls a series of functions with one function's result passed into the next 
    function. this is passed into the first function. Returns 
    the result of the last function. */
    reduce(...funcs) {
      let value = this;
      for (const func of funcs) {
        value = func.call(this, value);
      }
      return value;
    }
  };
};
