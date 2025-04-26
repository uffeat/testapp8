/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

import { modules } from "@/modules.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { component } = await modules.get("@/rollo/component/component.js");

const { Check } = await modules.get("@/rolloui/components/form/check.js");

document.body.append(Check());


if (["testapp8.vercel.app"].includes(location.host)) {
  console.log(await (await fetch("/api/foo")).text());
  console.log(await (await fetch("/api/bar")).text());
}



//const response = await fetch('/.netlify/functions/foo');
//console.log(await response.text())
