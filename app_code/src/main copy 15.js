import "./bootstrap.scss";
import "./main.css";

//
import { type } from "rollo/type/type";
import { name } from "rollo/type/factories/name";
import { clean } from "rollo/type/types/data/factories/clean";
import { clear } from "rollo/type/types/data/factories/clear";
import { clone } from "rollo/type/types/data/factories/clone";
import { difference } from "rollo/type/types/data/factories/difference";
import { filter } from "rollo/type/types/data/factories/filter";
import { for_each } from "rollo/type/types/data/factories/for_each";
import { freeze } from "rollo/type/types/data/factories/freeze";
import { items } from "rollo/type/types/data/factories/items";
import { pop } from "rollo/type/types/data/factories/pop";
import { reduce } from "rollo/type/types/data/factories/reduce";
import { text } from "rollo/type/types/data/factories/text";
import { update } from "rollo/type/types/data/factories/update";

await (async () => {
  //const { type } = await import("rollo/type/type");

  const Data = (() => {
    const composition = type.compose(
      Object,
      {},
      clean,
      clear,
      clone,
      difference,
      filter,
      for_each,
      freeze,
      items,
      name,
      pop,
      reduce,
      text,
      update
    );

    class Data extends composition {
      static create = (update) => {
        const instance = new Data().update(update);
        return new Proxy(this, {
          get: (target, key) => {
            return instance[key];
          },
          set: (target, key, value) => {
            instance[key] = value;
            return true;
          },
          has: (target, key) => {
            return key in instance.data;
          },
          apply: (target, thisArg, args) => {
            return instance.update.apply(instance, args);
          },
        });
      };

      constructor() {
        super();
      }

      toString() {
        return this.jsonable ? this.json() : this.text();
      }
    }

    return type.register("data", Data);
  })();

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
    name: "uffe",
  });

  data({ foo: "FOO", bar: "BAR" });
  console.log("data.data:", data.data);
})();

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`@/tests/${path}.js`);
    }
  });
}
