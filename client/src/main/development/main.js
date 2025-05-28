/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component } = await use("@/rollocomponent/");

import { State } from "@/rollostate/__init__.js";

const state = State(
  (change, { current, index, owner, previous, effect, session }) => {
    console.log("change:", change);

    console.log("current:", current);
    console.log("index:", index);
    console.log("owner:", owner);
    console.log("previous:", previous);
    console.log("effect:", effect);
    console.log("session:", session);
  }
);

console.log(state);

state.update({ foo: "FOO", bar: 42 });

console.log("change:", state.change);
console.log("current:", state.current);
console.log("previous:", state.previous);

state.effects.add(
  (change, { current, index, owner, previous, effect, session }) => {
    console.log("change:", change);

    console.log("current:", current);
    console.log("index:", index);
    console.log("owner:", owner);
    console.log("previous:", previous);
    console.log("effect:", effect);
    console.log("session:", session);
  }, {run: true}
);

console.info("Vite environment:", import.meta.env.MODE);
