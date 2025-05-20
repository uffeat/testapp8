import { server } from "@/rolloanvil/server.js";

try {
    const result = await server.meta();
    console.log("result:", result);
  } catch {
    console.warn("Endpoint failed");
  }