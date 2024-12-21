/* Factory that calls hook functions bound in 'call'. */
export const hooks = (parent, config, ...factories) => {
  return class hooks extends parent {
    constructor() {
      super();
    }
    
    /* .*/
    pipe(...funcs) {
      let result
      if (super.pipe) {
        result = super.pipe(...funcs)
      }

      for (const func of funcs.filter((func) => typeof func === "function")) {
        const r = func.call(this, result)
        if (r !== undefined) {
          result = r
        } 
      }
     
      

      return result;
    }
  };
};
