import { Collapse } from "bootstrap";
import { create } from "rollo/component";
import { mixin } from "@/rolloui/utils/mixin";

export function Collapsible({ open = false, ...updates } = {}, ...hooks) {
  const self = create("div.collapse", {
    attribute_constructorName: "Collapsible",
  });

  /* Create protected state items */
  self.$.open = open;
  self.$.transition = false;

  let controller;
  const initialize = () => {
    if (controller) {
      throw new Error(`'initialize' can only be called once.`);
    }
    controller = new Collapse(self);
    /* Set transitions state */
    self.on["hidden.bs.collapse"] = (event) => {
      self.$.transition = false;
    };
    self.on["shown.bs.collapse"] = (event) => {
      self.$.transition = false;
    };
  };

  if (open) {
    initialize();
  } else {
    /* Bootstrap cannot handle JS-initialized collapse components with a hidden 
    start state. Therefore postpone init until first call to open. */
    self.effects.add(
      function effect() {
        initialize();
        self.effects.remove(effect);
      },
      { open: true }
    );
  }

  /* Open/close and set transition state */
  self.effects.add(() => {
    if (controller) {
      controller[self.$.open ? "show" : "hide"]();
      self.$.transition = true;
    }
  }, "open");

  /* Create state machine with 4 reactive states:
  - showing
  - shown
  - hiding
  - hidden */

  /* Set showing state */
  self.effects.add(
    (data) => {
      self.$.showing = self.$.open && self.$.transition;
    },
    ["open", "transition"]
  );

  /* Set shown state */
  self.effects.add(() => {
    self.$.shown = self.$.open && !self.$.transition;
  }, ["open", "transition"]);

  /* Set hiding state */
  self.effects.add(() => {
    self.$.hiding = !self.$.open && self.$.transition;
  }, ["open", "transition"]);

  /* Set hidden state */
  self.effects.add(() => {
    self.$.hidden = !self.$.open && !self.$.transition;
  }, ["open", "transition"]);

  /* Create external API */
  mixin(
    self,
    class {
      get on_hidden() {
        return this._on_hidden;
      }
      /* Shortcut for setting an effect that reacts to hidden state */
      set on_hidden(on_hidden) {
        if (this._on_hidden) {
          this.effects.remove(this._on_hidden);
        }
        this._on_hidden = on_hidden;
        this.effects.add(this._on_hidden, { hidden: true });
      }

      get on_hiding() {
        return this._on_hiding;
      }
      /* Shortcut for setting an effect that reacts to hiding state */
      set on_hiding(on_hiding) {
        if (this._on_hiding) {
          this.effects.remove(this._on_hiding);
        }
        this._on_hiding = on_hiding;
        this.effects.add(this._on_hiding, { hiding: true });
      }

      get on_showing() {
        return this._on_showing;
      }
      /* Shortcut for setting an effect that reacts to showing state */
      set on_showing(on_showing) {
        if (this._on_showing) {
          this.effects.remove(this._on_showing);
        }
        this._on_showing = on_showing;
        this.effects.add(this._on_showing, { showing: true });
      }

      get on_shown() {
        return this._on_shown;
      }
      /* Shortcut for setting an effect that reacts to shown state */
      set on_shown(on_shown) {
        if (this._on_shown) {
          this.effects.remove(this._on_shown);
        }
        this._on_shown = on_shown;
        this.effects.add(this._on_shown, { shown: true });
      }

      /* Prop to show/hide */
      get open() {
        return this.$.open;
      }
      set open(open) {
        this.$.open = open;
      }

      /* Alternative to querying 'open' */
      is_open() {
        return this.open;
      }

      /* Chainable alternative to 'open=false' */
      hide() {
        this.$.open = false;
        return this;
      }

      /* Chainable alternative to 'open=true' */
      show() {
        this.$.open = true;

        return this;
      }

      /* Chainable alternative 'open=!open' */
      toggle() {
        this.$.open = !this.$.open;

        return this;
      }
    }
  );

  self.update(updates);
  self.call(...hooks);

  return self;
}
