import "./bootstrap.scss";
import "./main.css";
import { create } from "rollo/component";

// TODO
// ... then nav bar
// ... then Accordion
// ... then form
// ... then dropdown and popover
// ... then ProgressiveImage

// ... then loader
// ... then carousel
// ... then placeholder
// ... then tooltip
// ... then scrollspy

create("DIV", { id: "root", parent: document.body });

//////
const ID = "navbar";

const nav_bar = create(
  "NAV.navbar-expand-lg.bg-body-tertiary",
  {parent: root},
  create(
    "DIV.container-fluid",
    {},
    create("a.navbar-brand", {}, 
      create('span', {}, 'Brand')
    ),
    create(
      "BUTTON.navbar-toggler.pink",
      {
        type: "button",
        attributes: {
          dataBsToggle: "collapse",
          dataBsTarget: `#${ID}`,
          ariaControls: ID,
          ariaExpanded: "false",
          ariaLabel: "Toggle navigation",
        },
      },
      create("SPAN.navbar-toggler-icon")
    ),
    create(
      "DIV.collapse.navbar-collapse",
      { id: ID },
      /* TODO Use state to set active class and aria-current="page" */
      /* TODO Generate nav from array or object - a create controller to do so */
      create(
        "a.nav-link.active",
        {
          href: "#",
          attributes: {
            ariaCurrent: "page",
          },
        },
        "Home"
      ),
      create("a.nav-link", { href: "#" }, "Features"),
      create("a.nav-link", { href: "#" }, "Pricing"),
      create(
        "a.nav-link",
        {
          href: "#",
          attributes: {
            ariaDisabled: "true",
          },
        },
        "Disabled"
      )
    )
  )
);

//////
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
