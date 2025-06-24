/*
import { Pop } from "@/rollolibs/bootstrap/__init__.js";
const { Pop } = await use("@/rollolibs/bootstrap/");

*/

export { reboot } from "@/rollolibs/bootstrap/sheets/reboot.js";

export { Pop } from "@/rollolibs/bootstrap/tools/pop.js";

import { bootstrap } from "@/rollolibs/bootstrap/sheets/bootstrap.js";

bootstrap.adopt(document);

export { bootstrap as sheet };
