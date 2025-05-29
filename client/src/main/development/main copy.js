/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component, State } = await use("@/rollocomponent/");

const setup = (state) => {
  return component.div(
    { host: true },

    component.h1({
      key: "headline",
      state: state.effects.add(function (change) {
        this.text = this.state.text;
      }),
    })
  );
};

console.info("Vite environment:", import.meta.env.MODE);
