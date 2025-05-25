//import { MainNav } from '@/components/navs/main.js';

import { component } from "@/rollo/component/component.js";
import { Nav } from "@/rolloui/components/nav.js";

export const MainNav = (parent, ...hooks) => {
  const self = Nav(
    "nav-pills.d-flex.flex-column.row-gap-1.p-1",
    {
      slot: "side",
      parent
    },
    component.a("nav-link", { path: "/about" }, "About"),
    component.a("nav-link", { path: "/form" }, "Form"),
    component.a("nav-link", { path: "/colors" }, "Colors"),
    component.a("nav-link", { path: "/terms" }, "Terms"),
    component.a("nav-link", { path: "/blog" }, "Blog"),
    component.a("nav-link", { path: "/shop" }, "Shop"),
    component.a("nav-link", { path: "/plot" }, "Plot"),
    component.p({}, "TODO: Dropdown"),
    component.p({}, "TODO: Accordion")
  );

  hooks.forEach((h) => h.call(self, self))

  return self;
};
