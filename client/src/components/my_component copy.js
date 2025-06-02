import { author } from "@/rollocomponent/tools/author.js";
import { Component, component } from "@/rollocomponent/__init__.js";
import { State } from "@/rollocomponent/tools/state.js";
import { compose } from "@/rollocomponent/tools/compose.js";

await use("/sheets/my_component.css");

export const MyComponent = author(
  "MyComponent",
  class extends compose("tree") {
    static tree = (() => {
      const state = new State();

      const main = Component({}, component.h1({}, "Yo World!"))
      
      
      

      return () => main;
    })();
  }
);
