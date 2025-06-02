/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);

import { factory } from "@/rollocomponent/tools/factory.js";


import { index } from "@/rollocomponent/mixins/__index__.js";
import { mix } from "@/rollocomponent/tools/mix.js";
import { define } from "@/rollocomponent/tools/define.js";

import { component } from "@/rollocomponent/__init__.js";

import { State } from "@/rollocomponent/tools/state.js";

/* TODO Aggregate mix, define, tree, and factory into abstraction */



const composition = mix(HTMLElement, {}, ...index.create("shadow", "tree"));

const cls = class extends composition {
  static tree = (() => {
    const state = new State();

    const main = component.h1({}, "Yo World!");

    return () => main;
  })();
};

define("MyComponent", cls);


const MyComponent = factory(cls);




const my_component = MyComponent({ parent: document.body });
