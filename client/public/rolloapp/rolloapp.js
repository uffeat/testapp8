/*
import { rolloapp } from "@/rolloapp/rolloapp.js";
*/

const { Processor } = await use("/rolloapp/tools/processor.js");
const { app } = await use("/rolloapp/app.js");
const { build } = await use("/rolloapp/tools/assets.js");
const { construct } = await use("/rolloapp/tools/construct.js");

export { Processor, app, build, construct };
