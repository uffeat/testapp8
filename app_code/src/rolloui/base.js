/* 
20250305
src/rolloui/base.js
https://testapp8dev.anvil.app/_/api/asset?path=src/rolloui/base.js
import "rolloui/base";
import { RolloComponent } from "rolloui/base";
*/

import { bootstrap } from "@/libs/bootstrap/bootstrap.js";
import { Sheet } from "rollo/sheet/sheet.js";

import { assign } from "rollo/tools/assign.js";
import { compose } from "rollo/tools/cls/compose.js";
import { component } from "rollo/component/component.js";
import { registry } from "rollo/component/tools/registry.js";
import { Shadow } from "rollo/components/shadow.js";

import { attribute } from "rollo/component/factories/attribute.js";
import { classes } from "@/rollo/component/factories/classes.js";
import { connected } from "@/rollo/component/factories/connected.js";
import { content } from "rollo/component/factories/content.js";
import { css_vars } from "rollo/component/factories/css_vars.js";
import { data } from "rollo/component/factories/data.js";
import { detail } from "rollo/component/factories/detail.js";
import { handlers } from "rollo/component/factories/handlers.js";
import { name } from "rollo/component/factories/name.js";
import { parent } from "rollo/component/factories/parent.js";
import { props } from "rollo/component/factories/props.js";
import { send } from "rollo/component/factories/send.js";
import { style } from "rollo/component/factories/style.js";
import { tab } from "rollo/component/factories/tab.js";
import { value } from "rollo/component/factories/value.js";

/* Rolloui base component.
NOTE
- Can be used for direct instantiation: const self = component.rollo(); 
  or to extend from. */
export class RolloComponent extends compose(
  HTMLElement,
  {},
  attribute,
  classes,
  connected,
  content,
  css_vars,
  data,
  detail,
  handlers,
  name,
  parent,
  props,
  send,
  style,
  tab,
  value
) {
  static name = "RolloComponent";

  #__dict__ = {};
  #shadow;
  #sheet;
  #super_;

  constructor() {
    super();
    this.#shadow = Shadow(this, component.slot());
    this.shadow.sheets.add(bootstrap);

    this.#sheet = Sheet();

    const get_super = (key) => {
      return super[key];
    };

    const set_super = (key, value) => {
      super[key] = value;
    };

    this.#super_ = new Proxy(this, {
      get(target, key) {
        return get_super(key);
      },
      set(target, key, value) {
        set_super(key, value);
        return true;
      },
    });
  }

  /* NOTE
  - It's dirty to adopot/unadopt sheet to/from document as per connected/disconnected, 
    espcially since sheet may be empty. However, it simplifies DX in component 
    functions.
  - If this dirtiness proves to to hit performance (so far not an issue), 
    refactoring options include:
    - Purge the sheet feature entirely and implement in component functions PRN,
      optionally by still hooking in to connected/disconnected handlers.
    - In connectedCallback, check sheet size before adopting.
    - In connectedCallback/disconnectedCallback, toggle sheet's disabled status,
      rather than adopt/unadopt. Must, however, ensure an initial adoption to document
      (e.g., in constructor). */

  /* Adopts sheet to document. */
  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.sheet.bind(document);
  }

  /* Unadopts sheet from document. */
  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this.sheet.unbind(document);
  }

  /* Returns (by default unprotected) object that can be used to organize 
  values and objects during component authoring. 
  NOTE
  - Inspired by Python's '__dict__' concept. 
  - Can, but should typically not, be used beyond component authoring.
  - If pertinent, component functions may freeze, empty or remove this prop.. */
  get __dict__() {
    return this.#__dict__;
  }

  /* Returns shadow controller. */
  get shadow() {
    return this.#shadow;
  }

  /* Retuns a Sheet instance.
  NOTE
  - Useful for creating light-DOM CSS rules in component functions.
  - Should only be used for creating instance-specific scoped rules;
  - Can, but should typically not, be used beyond component authoring.
    */
  get sheet() {
    return this.#sheet;
  }

  /* Returns object, from which super items can be retrived/set. 
  NOTE
  - Can be useful, when using 'assign', if assigned classes need to access super. 
  - Can, but should typically not, be used beyond component authoring. */
  get super_() {
    return this.#super_;
  }

  /* Assigns members from source classes. */
  assign(...sources) {
    assign(this, ...sources);
    return this;
  }

  /* Applies mixin functions. */
  mixin(options, ...mixins) {
    mixins.forEach((mixin) => mixin(this, options))
    return this
  }
}

registry.add(RolloComponent);


