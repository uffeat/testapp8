import { type } from "rollo/type/type";
import { hooks } from "rollo/type/factories/hooks";
import { state } from "rollo/type/types/state/factories/state";

/* Implementation class for the 'state' factory. */
class StateType {
/* Returns clone with shallow copy of current data and everything else reset. */
clone() {
  return type.create("state", { ...this.current });
}

}

type.author("state", StateType, {}, hooks, state)

