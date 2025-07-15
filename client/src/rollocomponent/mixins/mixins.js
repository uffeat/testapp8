/*
import { mixins } from "@/rollocomponent/mixins/mixins.js";
const { mixins } = await use("@/rollocomponent/mixins/");

*/

console.log('HERE')

const mixins = {};
for (const [path, load] of Object.entries(
  import.meta.glob(["/src/rollocomponent/mixins/mixins/*.js"])
)) {

  const key = path.split("/").reverse()[0].slice(0, -".js".length)
  console.log('key:', key)


  mixins[path.split("/").reverse()[0].slice(0, -".js".length)] = (
    await load()
  ).default;
}
Object.freeze(mixins);

export { mixins };
