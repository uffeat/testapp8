/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

console.info("Vite environment:", import.meta.env.MODE);


import { MyComponent } from "@/components/my_component.js";

const my_component = MyComponent({ parent: document.body });
