/*
"@/main/preview/main.js"
import("@/main/preview/main.js");
20250520
*/

import "@/rollotest/__init__.js";


console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

document.querySelector("html").dataset.bsTheme = "dark";


const { component } = await use("@/rollocomponent/");
const { MyComponent } = await use("@/rollobs/components/my_component/");



const my_component = MyComponent({parent: document.body})





