/*
import { bootstrap } from "@/rollolibs/bootstrap/bootstrap.js";


*/

import Alert from "./src/alert.js";
import Button from "./src/button.js";
import Carousel from "./src/carousel.js";
import Collapse from "./src/collapse.js";
import Dropdown from "./src/dropdown.js";
import Modal from "./src/modal.js";
import Offcanvas from "./src/offcanvas.js";
import Popover from "./src/popover.js";
import ScrollSpy from "./src/scrollspy.js";
import Tab from "./src/tab.js";
import Toast from "./src/toast.js";
import Tooltip from "./src/tooltip.js";

import { main } from "./sheets/main.js";
import { reboot } from "./sheets/reboot.js";

main.adopt(document);

export const bootstrap = new (class {
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
