/*
import { compose } from "@/rollocomponent/tools/compose.js";
20250605
v.1.0
*/

import { mixins } from "@/rollocomponent/tools/mixins.js";
import { mix } from "@/rollocomponent/tools/mix.js";

/* Returns composed autonomous component class with standard mixins.
Option for specifiying additional mixins and for excluding certain standard 
mixins. */
export const compose = (...names) =>
  mix(HTMLElement, {}, ...mixins.select(...names));
