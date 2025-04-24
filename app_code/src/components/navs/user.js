//import { UserNav } from '@/components/navs/user.js'

import { component } from "rollo/component/component.js";
import { Nav } from "@/rolloui/components/nav.js";

const style = {
  minWidth: "4rem",
  display: "flex",
  justifyContent: "center",
};

export const UserNav = (parent, ...hooks) => {
  const self = Nav("nav-underline", { slot: "aux", parent });

  self.append(
    component.a("nav-link.text-reset", { path: "login", ...style }, "Log in"),
    component.a("nav-link.text-reset", { path: "signup", ...style }, "Sign up"),
    component.p({}, "TODO: Dropdown")
  );

  hooks.forEach((h) => h.call(self, self))

  return self;
};
