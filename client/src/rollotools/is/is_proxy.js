/*
import { is_proxy } from "@/rollotools/is/is_proxy.js";
const { is_proxy } = await use("@/rollotools/is/is_proxy.js");
20250616
v.1.0
*/

/* Checks if a value is a Proxy. */
export const is_proxy = (value) => {
  /* Proxies may throw errors when accessing their prototype. */
  try {
    return typeof value === "object" && value !== null && !Object.isExtensible(value);
  } catch {
    /* If accessing the prototype throws, it's likely a Proxy. */
    return true;
  }
};