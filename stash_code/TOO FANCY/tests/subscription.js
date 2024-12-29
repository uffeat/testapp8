// subscription

await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Effect } = await import("rollo/type/types/effect/effect");
  const { Subscription } = await import(
    "rollo/type/types/subscription/subscription"
  );

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  const publisher = Data.create({
    thing: 42,
    stuff: 8,
  });

  const effect = Effect.create(
    (data) => {
      //console.log(`'previous' from effect:`, data.previous);
      //console.log(`'current' from effect:`, data.current);
      //console.log(`'session' from effect:`, data.session);
    },
    (data) => {
      return true;
    }
  );

  data.effects.add(effect);

  data.effects.add(
    Effect.create((data) => {
      //console.log(`'previous' from effect:`, data.previous);
      console.log(`'current' from effect:`, data.current);
      //console.log(`'session' from effect:`, data.session);
    }, "foo")
  );

  data({ foo: "FOO", bar: "BAR" });
  data({ bar: "BARBAR" });

  data.bar = Subscription.create();
})();