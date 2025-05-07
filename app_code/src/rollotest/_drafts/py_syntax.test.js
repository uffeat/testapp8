const { bar } = await modules.import.src.test.bar.js()
console.log('bar:', bar)

const { foo } = await modules.import.public.test.foo.foo.js();
console.log('foo:', foo)

const raw_foo = await modules.import.src.test.foo.foo.js({ raw: true });
//const raw_foo = await modules.get('@/test/foo/foo.js', {raw: true})
console.log('raw_foo:', raw_foo)

const text = await modules.import.public.test.foo.foo.js({ raw: true });
console.log('text:', text)

//console.log("html:", await modules.get("@/test/foo/foo.html"));