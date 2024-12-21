import { type } from "rollo/type/type";
import { state } from "rollo/type/types/state/factories/state";

const Composite = type.compose(null, {}, state);

/* Implementation class for the 'state' factory. */
class State extends Composite {
  static create = (update) => {
    return new State().update(update);
  };
  constructor() {
    super();
  }
/* Returns clone with shallow copy of current data and everything else reset. */
clone() {
  return type.create("state", { ...this.current });
}

}


type.register("state", State);

