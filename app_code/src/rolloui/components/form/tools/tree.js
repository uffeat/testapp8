import { component } from "rollo/component/component.js";
import { Help } from "rollo/icons/help.js";
import { PopButton } from "rolloui/components/pop_button.js";

export const Tree = () => {
  return {
    feedback: component.p("invalid-feedback.d-flex.ps-1.m-0"),
    floating: component.div("form-floating"),
    group: component.div("input-group"),
    help: PopButton(
      "btn-dark.border._help",
      { ariaLabel: "Help" },
      Help({ size: 20 })
    ),
    input: component.input("form-control.w-100", {
      placeholder: " ",
      /* title: '' -> removes browser's default validation "tooltip". */
      title: "",
      type: "text",
    }),
    label: component.label(),
    prefix: component.span("input-group-text"),
    suffix: component.span("input-group-text.p-0"),
  };
};
