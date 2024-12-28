/* Implements 'pipe' method. */
export const hooks = (parent, config, ...factories) => {
  return class hooks extends parent {
    

    /* Calls pipe functions bound to this with result from one function passed 
    into the next. First function receives undefined (or result from an 
    up-chain 'pipe'). Returns result of last function. */
    pipe(...funcs) {
      let result;
      if (super.pipe) {
        result = super.pipe(...funcs);
      }
      for (const func of funcs.filter((func) => typeof func === "function")) {
        const r = func.call(this, result);
        if (r !== undefined) {
          result = r;
        }
      }
      return result;
    }
  };
};
