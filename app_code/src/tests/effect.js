// effect

await (async () => {
  const { Effect } = await import("rollo/type/types/effect/effect");

  const effect = Effect.create(
    (arg) => console.log(`Got arg:`, arg),
    (arg) => typeof arg === "number",
    (arg) => 2 * arg
  );

  effect(42);
  effect("foo");
})();
