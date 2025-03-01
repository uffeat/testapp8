import { compose } from "@/rollo/tools/cls/compose";
import { registry } from "@/rollo/component/tools/registry";
import { attribute } from "@/rollo/component/factories/attribute";
import { connected } from "@/rollo/component/factories/connected";
import { content } from "@/rollo/component/factories/content";
import { css_vars } from "@/rollo/component/factories/css_vars";
import { data } from "@/rollo/component/factories/data";
import { detail } from "@/rollo/component/factories/detail";
import { name } from "@/rollo/component/factories/name";
import { parent } from "@/rollo/component/factories/parent";
import { props } from "@/rollo/component/factories/props";
import { style } from "@/rollo/component/factories/style";
import { text } from "@/rollo/component/factories/text";
import { value } from "@/rollo/component/factories/value";

export class WebComponent extends compose(
  HTMLElement,
  {},
  attribute,
  connected,
  content,
  css_vars,
  data,
  descendants,
  detail,
  name,
  parent,
  props,
  style,
  text,
  value
) {
  static name = "WebComponent";
  constructor() {
    super();
  }
}

registry.add(WebComponent);
