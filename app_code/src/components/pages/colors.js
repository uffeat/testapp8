//import { Colors } from '@/components/pages/colors';

import { component } from "rollo/component/component";
import { Nav } from "@/rolloui/components/nav";

let color = 'pink'

/*  */
export const Colors = () => {
  const self = component.div(component.h1({}, "Colors"));

  const nav = Nav(
    "nav-pills.d-flex.justify-content-end.column-gap-1.p-1",
    { parent: self },
    component.a("nav-link", { detail: "pink" }, "Pink"),
    component.a("nav-link", { detail: "dodgerblue" }, "Dodger"),
    component.a("nav-link", { detail: "cornsilk" }, "Corn")
  );

  nav.active.effects.add(({ current }) => {
    if (current) {
      self.update({ backgroundColor: current.detail });
      color = current.detail;
    }
  });

  if (color) {
    const link = nav.find(`[detail="${color}"]`);
    nav.active.update(link);
  }

  return self;
};
