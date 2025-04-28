/* Global styles */
import "@/bootstrap.scss";
import "@/main.css";

//import { modules } from "@/rollovite/modules.js";
import { component } from "@/rollo/component/component.js";
//const { component } = await modules.get("@/rollo/component/component.js");
import { Check } from "@/rolloui/components/form/check.js";
//const { Check } = await modules.get("@/rolloui/components/form/check.js");

document.querySelector("html").dataset.bsTheme = "dark";

document.body.append(Check());

console.log(await (await fetch("/api/foo")).text());
console.log(await (await fetch("/api/bar")).text());
console.log(await (await fetch("/api/stuff")).text());
console.log(await (await fetch("/api/stuff/thing")).text());


await (async () => {
  const { server } = await import("@/rolloanvil/server.js");

  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };
  
  const result = await server.foo(data);
  console.log("result:", result);
  
  const raw = await server.foo(data, { raw: true });
  console.log("raw:", raw);
  
})();

