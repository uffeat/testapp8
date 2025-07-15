/* 
const { create_id } = await use("@/components/form/tools/id.js");
import { create_id } from "@/components/form/tools/id.js";
*/

export const create_id = (() => {
  let id = 0
  return () => id++
})();