
/* Purpose: Demonstrate and test type.macros */
await (async () => {
  const { type } = await import("@/rollo/type/type/type");

  const macro = (tag, ...args) => {
    if (tag !== "foo") return;

    type.register(
      class Foo {
        static name = "Foo";
        get bar() {
          return "BAR";
        }
      }
    );
    /* NOTE
    - returning true has the same effect as:
      type.macros.remove(macro)
    */
    return true;

  }

  type.macros.add(macro);

  /* Verify that macro registered class */
  if (type.create("foo").bar === "BAR") {
    console.log(`Success!`);
  } else {
    console.error(`Macro did not correctly register class`);
  }

  /* Verify that macro deregistered itself */
  if (type.macros.has(macro)) {
    console.error(`Macro did not deregistered itself`);
  } else {
    console.log(`Success!`);
  }
})();
