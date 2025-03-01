import { truncate } from "@/rollo/tools/text/truncate";

export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    /* Returns text representation of css rule. */
    text(pretty = true) {
      return pretty ? this.rule.cssText : truncate(this.rule.cssText);
    }
  };
};
