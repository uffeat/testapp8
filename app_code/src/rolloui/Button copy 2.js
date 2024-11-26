import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";
import { use_css } from "rollo/hooks/use_css";

function use_value(value) {
  return function () {
    /* Mixin to allow non-string values */
    mixin(
      this,
      class {
        get value() {
          return this._value;
        }
        set value(value) {
          this._value = value;
        }
      }
    );
    this.value = value
  };
}

export function Button({ css, value, ...updates } = {}, ...hooks) {
  const self = create("button.btn");

  self.update(updates);
  self.call(use_css(css), use_value(value), ...hooks);

  return self;
}
