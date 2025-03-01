import { component } from "@/rollo/component/component";
import { compose } from "@/rollo/tools/cls/compose";
import { registry } from "@/rollo/component/tools/registry";
import { WebComponent } from "@/rollo/components/web_component";
import { Sheet } from "@/rollo/sheet/sheet";
import { sheet as bootstrap } from "@/libs/bootstrap/bootstrap";

//import { shadow } from "@/rollo/component/factories/shadow";

const factory = (parent, config) => {
  return class extends parent {
    static name = "foo";

    #root;
    #sheet;

    __new__() {
      super.__new__ && super.__new__();
      this.attachShadow({ mode: "open" });
      this.#root = component.div({ id: "root" }, component.slot(), component.h3({}, 'In the shadow'));
      this.shadowRoot.append(this.#root);
      this.shadowRoot.adoptedStyleSheets.push(bootstrap)
      this.#sheet = Sheet(this.shadowRoot, {
        slot: { display: "flex", justifyContent: "center" },
      });
    }
  };
};

class cls extends compose(WebComponent, {}, factory) {
  static name = "FooComponent";
  constructor() {
    super();
  }
}

registry.add(cls);
