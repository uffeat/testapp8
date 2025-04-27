/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

//import { modules } from "@/rollovite/modules.js";
import { component } from "@/rollo/component/component.js";
//const { component } = await modules.get("@/rollo/component/component.js");
import { Check } from "@/rolloui/components/form/check.js";
//const { Check } = await modules.get("@/rolloui/components/form/check.js");

console.info("Vite environment:", import.meta.env.MODE);

document.querySelector("html").dataset.bsTheme = "dark";




document.body.append(Check());
