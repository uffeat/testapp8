/*
import { Anvil, AnvilComponent, anvil } from "@/rolloanvil/__init__.js";
const { Anvil, AnvilComponent, anvil } = await use("@/rolloanvil/");
20250703
v.1.3
*/

import { Anvil } from "@/rolloanvil/anvil.js";
export { AnvilComponent } from "@/rolloanvil/component.js";

const anvil = Anvil({
  slot: "data",
  parent: app,
});
//await anvil.connect();

export { Anvil, anvil };
