/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { modules } from "@/modules.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { component } = await modules.get("@/rollo/component/component.js");

const { Check } = await modules.get("@/rolloui/components/form/check.js");

document.body.append(Check());

console.dir(location);

if (["testapp8.vercel.app", "localhost:3000"].includes(location.host)) {
  const response = await fetch("/api/foo");
  console.log(await response.text());
}



//const response = await fetch('/.netlify/functions/foo');
//console.log(await response.text())
