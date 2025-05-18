import { app } from "@/rollovite/app.js";

/*  */
await (async () => {
  console.log("foo:", (await use("@/test/foo/foo.js")).foo);
  console.log("foo:", (await use.src.test.foo.foo.js).foo);
  console.log("foo:", (await use.public.test.foo.foo.js).foo);
})();

/* src js */
await (async () => {
  console.log("foo:", (await app.import("@/test/foo/foo.js")).foo);
  console.log("foo:", (await app.src.test.foo.foo.js).foo);
})();

/* src raw js */
await (async () => {
  console.log("foo:", await app.import("@/test/foo/foo.js?raw"));
  console.log("foo:", await app.src.test.foo.foo[":js?raw"]);
})();

/* public js */
await (async () => {
  console.log("foo:", (await app.import("/test/foo/foo.js")).foo);
  console.log("foo:", (await app.public.test.foo.foo.js).foo);
})();

/* public raw js */
await (async () => {
  console.log("foo:", await app.import("/test/foo/foo.js?raw"));
  console.log("foo:", await app.public.test.foo.foo[":js?raw"]);
})();

/* src html */
await (async () => {
  console.log("html:", await app.import("@/test/foo/foo.html"));
  console.log("html:", await app.src.test.foo.foo.html);
})();

/* public template */
await (async () => {
  console.log("template:", await app.import("/test/foo/foo.template"));
  console.log("template:", await app.public.test.foo.foo.template);
})();

/* importer */
await (async () => {
  const importer = app.importer("@/test");
  console.log("foo:", (await importer("foo/foo.js")).foo);
})();
