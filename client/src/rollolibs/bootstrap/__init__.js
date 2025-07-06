/*
import { Pop } from "@/rollolibs/bootstrap/__init__.js";
const { Pop } = await use("@/rollolibs/bootstrap/");

*/

import { main } from "@/rollolibs/bootstrap/sheets/main.js";
import { reboot } from "@/rollolibs/bootstrap/sheets/reboot.js";

import Alert from "./_src/alert.js";
import Button from "./_src/button.js";
import Carousel from "./_src/carousel.js";
import Collapse from "./_src/collapse.js";
import Dropdown from "./_src/dropdown.js";
import Modal from "./_src/modal.js";
import Offcanvas from "./_src/offcanvas.js";
import Popover from "./_src/popover.js";
import ScrollSpy from "./_src/scrollspy.js";
import Tab from "./_src/tab.js";
import Toast from "./_src/toast.js";
import Tooltip from "./_src/tooltip.js";

main.adopt(document);

const bootstrap = new (class {
  #_ = {};
  constructor() {
    this.#_.sheets = new (class {
      get main() {
        return main;
      }

      get reboot() {
        return reboot;
      }
    })();
  }

  get sheets() {
    return this.#_.sheets;
  }

  get Alert() {
    return Alert;
  }

  get Button() {
    return Button;
  }

  get Carousel() {
    return Carousel;
  }

  get Collapse() {
    return Collapse;
  }

  get Dropdown() {
    return Dropdown;
  }

  get Modal() {
    return Modal;
  }

  get Offcanvas() {
    return Offcanvas;
  }

  get Popover() {
    return Popover;
  }

  get ScrollSpy() {
    return ScrollSpy;
  }

  get Tab() {
    return Tab;
  }

  get Toast() {
    return Toast;
  }

  get Tooltip() {
    return Tooltip;
  }
})();

Object.defineProperty(window, "bootstrap", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: bootstrap,
});

export { bootstrap };
