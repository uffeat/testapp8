//import { parse } from "rollo/component/tools/parse";

import { is_node } from "rollo/tools/is/is_node";

/* Returns parsed arguments. */
export const parse = (arg, ...args) => {
  const [tag, ...css_classes] = arg.split(".");
  const parsed = {
    children: args.filter(is_node),
    css_classes: css_classes.length ? css_classes : null,
    hooks: args.filter((a) => typeof a === "function"),
    tag,
    updates:
      args
        .filter((a) => typeof a === "object" && !(a instanceof HTMLElement))
        .at(0) || {},
  };

  if ("__config__" in parsed.updates) {
    parsed.__config__ = parsed.updates.__config__;
    delete parsed.updates.__config__;
  } else {
    parsed.__config__ = {};
  }

  if ("parent" in parsed.updates) {
    parsed.parent = parsed.updates.parent;
    delete parsed.updates.parent;
  }

  return parsed;
};
