/*
rollovite/batch/modules
*/

import { Modules } from "@/rollovite/modules.js";

/* Does base work without parent path? */
export const dong = async (unit) => {
  const dong = new Modules("js", import.meta.glob("/src/test/**/*.js"), {
    base: "test/foo",
  });
  console.log("ding:", (await dong.$.ding[":js"]).ding);
  console.log("ding:", (await dong.import("ding.js")).ding);
};

/* Does base work? */
export const thing = async (unit) => {
  const thing = new Modules("js", import.meta.glob("/src/test/**/*.js"), {
    base: "test",
  });

  console.log("foo:", (await thing.import("foo/foo.js")).foo);
  console.log("foo:", (await thing.$.foo.foo[":js"]).foo);
  console.log("foo:", (await thing.$.foo.foo[":js"]).foo);
};

/* Does base batch import? */
export const stuff = async (unit) => {
  const stuff = new Modules("js", import.meta.glob("/src/test/**/*.js"));

  console.log("foo:", (await stuff.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);
  console.log("foo:", (await stuff.$.test.foo.foo[":js"]).foo);

  await (async () => {
    const modules = await stuff.import((specifier) =>
      ["@/test/batch/a.js", "@/test/batch/b.js"].includes(specifier)
    );
    console.log("modules:", modules);
  })();
};
