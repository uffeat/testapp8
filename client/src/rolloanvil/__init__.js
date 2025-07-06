/*
import { Anvil, anvil } from "@/rolloanvil/__init__.js";
const { Anvil, anvil } = await use("@/rolloanvil/");
20250703
v.1.3
*/

import { Anvil } from "@/rolloanvil/anvil.js";


const anvil = Anvil({
  slot: "data",
  parent: app,
  display: 'none'
});

await anvil.connect();


export { Anvil, anvil };
