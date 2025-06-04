/*
import { WebComponent } from "@/rollocomponent/web_component.js";
20250605
v.1.1
*/

import { author } from "@/rollocomponent/tools/author.js";
import { compose } from "@/rollocomponent/tools/compose.js";

const cls = compose();

/* Returns instance of basic autonomous web component. */
export const WebComponent = author(cls, "web-component");
