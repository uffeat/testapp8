import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO form
// ... then dropdown and popover
// ... then ProgressiveImage
// ... then nav bar

create("", { id: "root", parent: document.body });

import { mixin } from "rollo/utils/mixin";
import { Collapse } from "bootstrap";

function Collapsible({ open = false, ...updates } = {}, ...hooks) {
  const self = create("div.collapse", { attr_constructorName: "Collapsible" });

  /* Create protected state items */
  const set_open = self.reactive.protected.add("open", open);
  const set_transition = self.reactive.protected.add("transition", false);
  const set_showing = self.reactive.protected.add("showing");
  const set_hiding = self.reactive.protected.add("hiding");
  const set_shown = self.reactive.protected.add("shown");
  const set_hidden = self.reactive.protected.add("hidden");

  let controller;
  const initialize = () => {
    if (controller) {
      throw new Error(`'initialize' can only be called once.`);
    }
    controller = new Collapse(self);
    /* Set transitions state */
    self.on["hidden.bs.collapse"] = (event) => {
      set_transition(false);
    };
    self.on["shown.bs.collapse"] = (event) => {
      set_transition(false);
    };
  };

  if (open) {
    initialize();
  } else {
    /* Bootstrap cannot handle JS-initialized collapse components with a hidden 
    start state. Therefore postpone init until first call to open. */
    self.effects.add(
      function effect(data) {
        initialize();
        self.effects.remove(effect);
      },
      { open: true }
    );
  }

  /* Open/close and set transition state */
  self.effects.add((data) => {
    if (controller) {
      controller[self.$.open ? "show" : "hide"]();
      set_transition(true);
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
      set_showing(self.$.open && self.$.transition);
    },
    ["open", "transition"]
  );

  /* Set shown state */
  self.effects.add(
    (data) => {
      set_shown(self.$.open && !self.$.transition);
    },
    ["open", "transition"]
  );

  /* Set hiding state */
  self.effects.add(
    (data) => {
      set_hiding(!self.$.open && self.$.transition);
    },
    ["open", "transition"]
  );

  /* Set hidden state */
  self.effects.add(
    (data) => {
      set_hidden(!self.$.open && !self.$.transition);
    },
    ["open", "transition"]
  );

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

      get open() {
        return this.$.open;
      }
      set open(open) {
        set_open(open);
      }
    }
  );

  self.update(updates);
  self.call(...hooks);

  return self;
}

const content = create("h1.text-bg-primary.p-3", {}, "Foo");
const collapsible = Collapsible(
  {
    parent: root,
    open: true,
  },
  content
);
collapsible.on_showing = (data) => console.log("Showing...");
collapsible.on_shown = (data) => console.log("Shown!");
collapsible.on_hiding = (data) => console.log("Hiding...");
collapsible.on_hidden = (data) => console.log("Hidden!");

const show_button = create(
  "button.btn",
  {
    parent: root,
    on_click: (event) => {
      collapsible.open = true;
    },
  },
  "Show"
);
const hide_button = create(
  "button.btn",
  {
    parent: root,
    on_click: (event) => {
      collapsible.open = false;
    },
  },
  "Hide"
);

if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
