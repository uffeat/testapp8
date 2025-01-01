// data_effect

/* Purpose: Demonstate and test effect */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Effect } = await import("rollo/type/types/data/tools/effect");
  const { create_condition } = await import("rollo/type/types/data/tools/create_condition");


  const data = Data({
    foo: "foo",
    bar: "bar",
  });

  const effect = Effect({
    source: (change) => {
      const current = Data(change.current);
      console.log(`current:`, current.data);
      /* Check that initial condition works */

      for (const key of current.keys) {
        if (!["foo", "bar"].includes(key)) {
          console.error(`Unexpected key:`, key);
        }
      }
      /* Check that updated condition works */
      if (current.includes({ foo: 42 })) {
        console.error(
          `Should NOT react to {foo: 42}!. Updated condition does NOT work!`
        );
      }
      /* Check that disabled works */
      if (current.includes({ bar: "BAR" })) {
        console.error(
          `Should NOT react to {bar: 'BAR'}! 'disabled' does NOT work!`
        );
      }
    },
    condition: create_condition(["foo", "bar"]),
  });

  data.effects.add(effect);

  /* Condition should prevent effect from reating */
  data.$.stuff = 8;

  /* Change condition so that that it replicates original condition, 
  but also does not accept {foo: 42} */
  effect.condition = (change) => {
    const current = Data(change.current);
    const keys = ["foo", "bar"];
    for (const [k, v] of current.entries) {
      if (!keys.includes(k)) {
        return;
      }
      if (k === "foo" && v === 42) {
        return;
      }
    }
    return true;
  };

  data.$.bar = 2;

  /* Updated condition should prevent effect from reating */
  data.$.foo = 42;

  /* Diable effect */
  effect.disabled = true;

  /* Disabling should prevent effect from reating */
  data.$.bar = "BAR";

  //console.log(`data.data:`, data.data);
})();
