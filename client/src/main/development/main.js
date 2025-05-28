/*
"@/main/development/main.js"
20250520
*/

import "@/rollotest/__init__.js";
import "@/main/development/rollometa/__init__.js";

const { component } = await use("@/rollocomponent/");
const { MyComponent } = await use("@/rollobs/components/my_component/");



const my_component = MyComponent({parent: document.body})







console.info("Vite environment:", import.meta.env.MODE);

