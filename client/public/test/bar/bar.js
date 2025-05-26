const { foo } = await use("@/test/foo/foo.js");
console.log('foo from bar:', foo)
export const bar = {bar: "BAR"};
export { foo };
