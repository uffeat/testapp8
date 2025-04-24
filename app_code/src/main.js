/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { modules } from "@/modules.js";

document.querySelector("html").dataset.bsTheme = "dark";



const { component } = await modules.get("@/rollo/component/component.js");

const { Check } = await modules.get("@/rolloui/components/form/check.js");

document.body.append(Check());
