/*
import "@/main/development/rollometa/__init__.js"
20250521
*/

import { server } from "@/rolloanvil/server.js";

/* Calls endpoint. */
const update = async () => {
  try {
    const result = await server.meta();
    console.log("result:", result);
  } catch {
    console.warn("Endpoint failed");
  }
};

/* Trigger meta files update */
window.addEventListener("keydown", async (event) => {
  if (event.code === "KeyM" && event.shiftKey) {
    await update();
    console.info(`Meta files updated.`);
    return;
  }
});
