// effect

await (async () => {
  const { Effect } = await import(
    "rollo/type/types/effect/effect"
  );

  const effect = Effect.create((arg) => console.log(`Got arg:`, arg), {
    condition: (arg) => typeof arg === "number",
    transformer: (arg) => 2 * arg,
  });

  effect(42);
  effect("foo");
})();