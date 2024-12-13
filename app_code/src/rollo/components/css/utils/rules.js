/* Base controller for CSSRuleLists. */
class BaseRulesController {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns css rules list as an array. */
  get rules() {
    return [...this.owner.cssRules];
  }

  /* Returns length of css rules list. */
  get size() {
    return this.owner.cssRules.length;
  }
}

/* CSSRuleLists controller for CSSGroupingRules or CSSStyleSheets. */
export class RulesController extends BaseRulesController {
  constructor(owner) {
    super(owner);
  }

  /* Creates, appends and returns rule. */
  add(text) {
    /* Expects text in the format: `<selector>` */
    if (!text.trim().endsWith("}")) {
      text = `${text} {}`;
    }
    const index = this.owner.insertRule(text, this.size);
    return this.owner.cssRules[index];
  }

  /* Returns index of rule; undefined if not found. */
  find(rule) {
    for (const [index, _rule] of this.rules.entries()) {
      if (rule === _rule) {
        return index;
      }
    }
  }

  /* Deletes rule. */
  remove(rule) {
    const index = this.find(rule);
    if (index !== undefined) {
      this.owner.deleteRule(index);
    }
  }
}

/* CSSRuleLists controller for CSSKeyframesRules. */
export class FrameRulesController extends BaseRulesController {
  constructor(owner) {
    super(owner);
  }

  /* Creates, appends and returns rule without items. */
  add(frame) {
    this.owner.appendRule(`${frame}% {}`);
    return this.owner.findRule(`${frame}%`);
  }

  /* Deletes rule. */
  remove(rule) {
    const key_text = rule.keyText;
    for (const rule of this.rules) {
      if (rule.keyText === key_text) {
        this.owner.deleteRule(key_text);
      }
    }
  }
}