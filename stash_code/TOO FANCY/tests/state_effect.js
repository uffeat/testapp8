// state_effect

await (async () => {
  const { type } = await import("rollo/type/type");
  await import("rollo/type/types/state/state");
  await import("rollo/type/types/state/subscription");

  const state = type.create("state", {
    name: "my_state",
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,
  });

  state.effects.add((data) => {
    //console.log("data:", data);
    console.log("previous from effect:", data.previous);
    console.log("current from effect:", data.current);
  });

  state.foo = "FOO";
  state({bar: 'BAR'})
  state.update({bar: 'BARBAR'})

  console.log("current:", state.current);
  console.log("previous:", state.previous);
})();