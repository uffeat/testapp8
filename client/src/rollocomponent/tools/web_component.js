/*
import { WebComponent } from "@/rollocomponent/web_component.js";
20250605
v.1.1
*/


const { author } = await use("@/rollocomponent/");

/* Returns instance of basic autonomous web component. */
export const WebComponent = author(HTMLElement, "web-component");
