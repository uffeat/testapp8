import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { use_css } from "rollo/hooks/use_css";

export function Button({ css, ...updates } = {}, ...hooks) {
  const self = create("button.btn");

  /* Mixin to allow non-string values */
  mixin(
    self,
    class {
      get value() {
        return this._value;
      }
      set value(value) {
        this._value = value
      }
    }
  );

  self.update(updates)
  self.call(use_css(css), ...hooks)

  return self
}
