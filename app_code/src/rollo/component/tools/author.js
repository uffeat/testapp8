/* 
20250302 
src/rollo/component/tools/author.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rollo/component/tools/author.js
import { author } from "rollo/component/tools/author.js";
*/

import { compose } from "rollo/tools/cls/compose.js";
import { registry } from "rollo/component/tools/registry.js";
/* Factories */
import { __config__ } from "rollo/component/factories/__config__.js";
import { attribute } from "rollo/component/factories/attribute.js";
import { classes } from "rollo/component/factories/classes.js";
import { connected } from "rollo/component/factories/connected.js";
import { content, elements } from "rollo/component/factories/content.js";
import { css_vars } from "rollo/component/factories/css_vars.js";
import { data } from "rollo/component/factories/data.js";
import { detail } from "rollo/component/factories/detail.js";
import { for_ } from "rollo/component/factories/for_.js";
import { handlers } from "rollo/component/factories/handlers.js";
import { name } from "rollo/component/factories/name.js";
import { no_validation } from "rollo/component/factories/no_validation.js";
import { parent } from "rollo/component/factories/parent.js";
import { path } from "rollo/component/factories/path.js";
import { props } from "rollo/component/factories/props.js";
import { send } from "rollo/component/factories/send.js";
import { style } from "rollo/component/factories/style.js";
import { super_ } from "rollo/component/factories/super_.js";
import { tab } from "rollo/component/factories/tab.js";
import { text } from "rollo/component/factories/text.js";
import { value } from "rollo/component/factories/value.js";

/* Composes and registers component. Returns component class. */
export function author(tag) {
  const reference = document.createElement(tag);
  const base = reference.constructor;
  if (base === HTMLUnknownElement) {
    throw new Error(
      `Cannot author component with tag '${tag}'. Must be native.`
    );
  }

  const registered = registry.get(tag)
  if (registered) {
    return registered
  }

  /* General factories */
  const factories = [
    __config__,
    attribute,
    classes,
    connected,
    content,
    css_vars,
    data,
    detail,
    handlers,
    parent,
    props,
    send,
    style,
    tab,
  ];
  /* Add specialized factories */
  if (tag === "form") {
    factories.push(no_validation);
  }
  if (tag !== "form") {
    factories.push(elements);
  }
  if (tag === "label") {
    factories.push(for_);
  }
  if ("href" in reference) {
    factories.push(path);
  }
  if (!("name" in reference)) {
    factories.push(name);
  }
  if ("textContent" in reference) {
    factories.push(text);
  }
  if (!("value" in reference)) {
    factories.push(value);
  }

  factories.push(super_);

  const config = { observedAttributes: [] };
  class cls extends compose(base, config, ...factories) {
    static observedAttributes = config.observedAttributes;
    static name = "Native";

    constructor() {
      super();
      this.setAttribute("web-component", "");
    }
  }

  return registry.add(cls, { tag });
}
