import { server } from "@/rolloanvil/server.js";

try {
    const result = await server.manifest();
    console.log("result:", result);
  } catch {
    console.warn("manifest not updated");
  }