/*
import foo from "@/rolloapp/_mixins/foo.js";
202505626
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    static __name__ = "foo";

    get foo() {
      return 'FOO'
    }
  };
};
