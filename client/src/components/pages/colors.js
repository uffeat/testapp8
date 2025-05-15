//import { Colors } from '@/components/pages/colors.js';

import { component } from "@/rollo/component/component.js";
import { Nav } from "@/rolloui/components/nav.js";

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

  nav.effects.add(({ current }) => {
    if (current) {
      self.update({ backgroundColor: current.detail });
      color = current.detail;
    }
  });

  if (color) {
    const link = nav.find(`[detail="${color}"]`);
    nav.state.update(link);
  }

  return self;
};
