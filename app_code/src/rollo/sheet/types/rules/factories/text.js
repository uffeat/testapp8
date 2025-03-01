import { truncate } from "@/rollo/tools/text/truncate";

export const text = (parent, config, ...factories) => {
  return class extends parent {
    static name = "text";

    /* Returns text representation of rules. */
      text(pretty = true) {
        const type = this.__dict__.signature.type;
        return [...this.owner.cssRules]
          .filter((r) => r instanceof type)
          .map((r) => (pretty ? r.cssText : truncate(r.cssText)))
          .join(pretty ? "\n" : " ");
      }

   
  };
};
