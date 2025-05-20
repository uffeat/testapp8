import "@/rollotest/__init__.js";
import { component } from "@/rollo/component/component.js";
import { Check } from "@/rolloui/components/form/check.js";

console.info("Vercel environment:", import.meta.env.VERCEL_ENV);

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

