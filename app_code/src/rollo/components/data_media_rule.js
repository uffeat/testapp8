import { Component, create } from "rollo/component";
import "rollo/components/data_rule";

/* Non-visual web component for dynamic rules. */
const data_media_rule = (parent) => {
  const cls = class DataMediaRule extends parent {
    #rule;
    #selector;
    #sheet;
    constructor(sheet, selector, block) {
      this.#sheet = sheet;
      this.#selector = selector;
      const index = sheet.insertRule(`${selector} {}`, sheet.cssRules.length);
      this.#rule = sheet.cssRules[index];
      this.update(block);
    }

    /* Only available during creation. 
    Called:
    - after CSS classes
    - after 'update' 
    - after children
    - after 'call'
    - before live DOM connection */
    created_callback() {
      super.created_callback && super.created_callback();
      this.style.display = "none";
    }

    get rule() {
      return this.#rule;
    }

    get selector() {
      return this.#selector;
    }

    get sheet() {
      return this.#sheet;
    }

    update(block = {}) {
      for (const [selector, items] of Object.entries(block)) {
        if (items === undefined) {
          continue;
        }
        create('data-rule', {}, this.rule, selector, items)
        
       
      }
    }
  };

  return cls;
};

Component.author("data-media-rule", HTMLElement, {}, data_media_rule);
