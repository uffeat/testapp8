/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component } = await use("@/rollocomponent/");

import { State } from "@/rollostate/__init__.js";

const state = State((change, { owner }) => {
  console.log("change:", change);
  console.log("owner:", owner);
});

console.log(state);

state.update({ foo: "FOO", bar: 42 });

console.log("change.entries():", state.change.entries());
console.log("current.entries():", state.current.entries());
console.log("previous.entries():", state.previous.entries());

console.info("Vite environment:", import.meta.env.MODE);
