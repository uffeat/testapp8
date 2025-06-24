/*
import { Pop } from "@/rollolibs/bootstrap/tools/pop.js";
*/

import { Ref } from "@/rollostate/ref.js";
import { Popover } from "@/rollolibs/bootstrap/bootstrap.js";



export class Pop {
  #_ = {
    pop: null,
    states: {},
  };

  constructor(target, { content = " " } = {}) {
    this.#_.states.active = new Ref({ initial: false, name: "active" });
    this.#_.states.show = new Ref({ initial: false, name: "show" });

    this.#_.target = target;
    this.#_.content = content;

    this.#_.states.active.effects.add(
      (current) => this.#dispose(),
      [false]
    );

    this.#_.target.on["shown.bs.popover"] = (event) => {
      this.#_.states.active.$ = true;
    };

    /* HACK Injects content container into popover body. Mitigates Bootstrap's 
    failure to correctly set content and enables click handlers on content. */
    this.#_.target.on["inserted.bs.popover"] = (event) => {
      const body = this.#_.target.querySelector(".popover-body");
      /* Clearing innerHTML seems to be redundant in practice, but the 
      idea is the ensure that the single-space content does not show. */
      body.innerHTML = "";
      body.append(this.#_.content);
    };

    this.#_.target.on["hidden.bs.popover"] = (event) => {
      this.#_.states.active.$ = false;
    };

    this.#_.states.show.effects.add((current) => {
      if (current) {
        this.#init();
        this.#show();
      } else {
        this.#hide();
      }
    });

    this.#_.target.on.click = (event) => {
      if (this.#_.states.active.$) {
        this.#_.states.show.$ = false;
      } else {
        this.#_.states.show.$ = true;
      }
    };
    this.#_.target.on.keydown = (event) => {
      if (event.code === "Escape") {
        this.#_.states.show.$ = false;
      }
    };
    this.#_.target.on.blur = (event) => {
      this.#_.states.show.$ = false;
    };
  }

  #dispose() {
    //console.log("Disposing"); //
    this.#_.pop?.dispose();
    this.#_.pop = null;
  }

  #hide() {
    this.#_.pop?.hide();
  }

  #init() {
    this.#_.pop = new Popover(this.#_.target, {
      container: this.#_.target,
      //content: this.#_.content,
      content: ' ',
      trigger: "manual",
    });
  }

  #show() {
    this.#_.pop?.show();
  }
}