/*
import anvil from "@/rolloapp/_mixins/anvil.js";
202505626
v.1.0
*/
import { anvil } from "@/rolloanvil/anvil.js";

export default (parent, config) => {
  return class extends parent {
    static __name__ = "anvil";

    #_ = {};

    __new__() {
      super.__new__?.();

    
    }

    get anvil() {
      return anvil
    }
  };
};
