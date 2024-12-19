import { type } from "rollo/type/type";
import { list } from "rollo/type/types/list/factories/list";

/* . */
class ListType extends Array {
  constructor() {
    super();
  }
}

type.author("list", ListType, {}, list).assign(
  class {
    /* Returns shallow clone. */
    clone() {
      return type.create("list", {}, ...this);
    }
  }
);
