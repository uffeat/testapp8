import { server } from "@/rolloanvil/server.js";

if (import.meta.env.DEV) {
  try {
    const result = await server.manifest();
    console.log("result:", result);
  } catch {
    console.warn("manifest not updated");
  }
}