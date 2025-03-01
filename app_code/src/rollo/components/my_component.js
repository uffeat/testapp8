import { registry } from "@/rollo/component/tools/registry";
import { compose } from "@/rollo/tools/cls/compose";
import { parent } from "@/rollo/component/factories/parent";
import { props } from "@/rollo/component/factories/props";
import { style } from "@/rollo/component/factories/style";
import { text } from "@/rollo/component/factories/text";

class cls extends compose(HTMLElement, {}, parent, props, style, text) {
  static name = "MyComponent";
  constructor() {
    super();
  }
}

registry.add(cls);
