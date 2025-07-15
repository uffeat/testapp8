/*
import { mixins } from "@/rollocomponent/mixins/mixins.js";
const { mixins } = await use("@/rollocomponent/mixins/");

*/

const mixins = {};
for (const [path, load] of Object.entries(
  import.meta.glob(["/src/rollocomponent/mixins/mixins/*.js"])
)) {
  mixins[path.split("/").reverse()[0].slice(0, -".js".length)] = (
    await load()
  ).default;
}
Object.freeze(mixins);

export { mixins };
