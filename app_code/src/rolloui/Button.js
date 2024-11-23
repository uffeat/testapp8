import { create } from "rollo/component";
import { mixin } from "rollo/utils/mixin";

export class Button {
  static create(...args) {
    return new Button(...args);
  }

  constructor({ style, ...props }, ...children) {
    const component = create("button.btn", props, ...children);
    mixin(component, Button.prototype);
    if (style) {
      component.add_style(style);
    }
    return component;
  }

  add_style(style) {
    this.classList.add(`btn-${style}`);
  }
}
