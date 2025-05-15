import { modules } from "@/rollovite/modules.js";
import { module } from "@/rollo/tools/module.js";
import { component } from "@/rollo/component/component.js";

const extension = "js.html";
const cache = {};

modules.processors.add({
  [extension]: async (path, html) => {
    if (path in cache) {
      return cache[path];
    }
    const element = component.div({ innerHTML: html });
    const result = await module.from_text(
      element
        .querySelector("template[script]")
        .content.querySelector("script")
        .text.trim()
    );
    cache[path] = result;
    return result;
  },
});
