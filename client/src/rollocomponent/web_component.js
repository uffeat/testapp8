/*
import { WebComponent } from "@/rollocomponent/web_component.js";
20250602
v.1.0
*/

import { compose } from "@/rollocomponent/tools/compose.js";
import { factory } from "@/rollocomponent/tools/factory.js";

const cls = compose();
const tag = "web-component";
customElements.define(tag, cls);
if (import.meta.env.DEV) {
  console.info("Registered component with tag:", tag);
}
/* Returns instance of basic autonomous web component. */
export const WebComponent = factory(cls);
