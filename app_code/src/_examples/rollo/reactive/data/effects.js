/* Primary purpose: Test and demo of effects. 
Also features
- $
- detail
- includes
- update
*/
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");
  const { Effect } = await import("@/rollo/type/types/reactive/tools/effect");
  const { Condition } = await import(
    "@/rollo/type/types/reactive/data/tools/condition"
  );

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      error(expected, actual);
    }
  };

  /* Basic reactivity */
  Data({ foo: 1, bar: 2 }, { detail: { count: 0 } }, (state) => {
    state.effects.add((change) => ++change.owner.detail.count);
    state.update({ foo: 2, stuff: 42 }); // Triggers count=1
    state.update({ foo: 2 }); // Does not trigger
    state.update({ bar: 2, stuff: undefined }); // Triggers count=2
    state.update({ stuff: undefined }); // Does not trigger
    /* Check that effect was called expected number of times */
    test(2, state.detail.count);
  });

  /* Higher-order, immediately run and self-deregistering effects */
  Data(null, {}, (state) => {
    const effect = (change) => {
      ////console.log("change:", change); ////
      effect._count = effect._count === undefined ? 1 : ++effect._count;
      if (change.data.removed.includes("hot")) {
        change.owner.effects.remove(change.effect);
      }
    };
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      if (Object.keys(change.data.added).includes("hot")) {
        change.owner.effects.add(effect, true);
        change.owner.effects.remove(change.effect);
      }
    });
    state.$.hot = true;
    state.$.foo = "FOO";
    state.$.hot = undefined;
    state.$.bar = "BAR";
    /* Check that effect was called expected number of times */
    test(3, effect._count);
    /* Check that effects self-dregistered */
    test(0, state.effects.size());
  });

  /* Conditional effects */
  Data(null, {}, (state) => {
    const required = ["foo", "bar"];
    const effect = Effect((change) => {
      ////console.log("change:", change); ////
      change.effect.detail.called = true;
      /* Check that effect was called as per condition */
      if (
        new Set(required).union(new Set(Object.keys(change.data.current))).size
      ) {
        success();
      } else {
        console.error(`Conditional effect did not work!`);
      }
    }, Condition.create(required));
    state.effects.add(effect);
    state.update({ foo: "FOO", stuff: 42 });
    state.$.bar = "BAR";
    state.$.thing = true;
    /* Check that effect was called */
    test(true, effect.detail.called);
  });
  Data(null, {}, (state) => {
    const required = { stuff: 42 };
    const effect = Effect((change) => {
      ////console.log("change:", change); ////
      change.effect.detail.called = true;
      /* Check that effect was called as per condition */
      if (Data(change.data.current).includes(required)) {
        success();
      } else {
        console.error(`Conditional effect did not work!`);
      }
      change.effect.detail.called = true;
    }, Condition.create(required));
    state.effects.add(effect);
    state.update({ foo: "FOO", stuff: 42 });
    state.$.bar = "BAR";
    state.$.stuff = true;
    /* Check that effect was called */
    test(true, effect.detail.called);
  });

  /* Effect that changes current */
  Data(null, {}, (state) => {
    const hot = { hot: true };
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      change.owner.update(hot);
    });
    state.$.foo = "FOO";
    /* Check that effect changed current correctly */
    if (state.includes(hot)) {
      success();
    } else {
      console.error(`Does not include:`, hot);
    }
  });

  /* Custom effect type for automatic triggering */
  Data(null, {}, (state) => {
    const HOT = "hot";
    state.effects.add(
      Effect((change) => {
        ////console.log("change:", change); ////
        change.owner.effects.call({ value: change.data.current[HOT] }, HOT);
      }, Condition.create(HOT))
    );
    const effect = (change) => {
      ////console.log("change:", change); ////
      if (effect._results) {
        effect._results.push(change.data.value);
      } else {
        effect._results = [change.data.value];
      }
    };
    state.effects.add(effect, HOT);
    state.$.stuff = true;
    const values = [true, 42];
    values.forEach((value) => (state.$.hot = value));
    /* Check that effect was correctly called */
    test(JSON.stringify(values), JSON.stringify(effect._results));
  });

  /* Custom effect type for explicit triggering */
  Data(null, {}, (state) => {
    const HOT = "hot";
    const effect = (change) => {
      ////console.log("change:", change); ////
      if (effect._results) {
        effect._results.push(change.data.value);
      } else {
        effect._results = [change.data.value];
      }
    };
    state.effects.add(effect, HOT);
    const values = [true, 42];
    values.forEach((value) => state.effects.call({ value }, HOT));
    /* Check that effect was correctly called */
    test(JSON.stringify(values), JSON.stringify(effect._results));
  });
})();
