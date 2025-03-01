/* Primary purpose: Test and demo of effect, incl.
- reusable effect functions
- breaking effects
- higher-order and self-deregistering effects
- conditional effects
- effects that change current
- immediately run effects
- custom effect types
- explicit triggering of effects
- use of effect results
Also features
- detail
- change.detail
- change.index
*/
await (async () => {
  const { Value } = await import("@/rollo/type/types/reactive/value/value");
  const { Condition } = await import(
    "@/rollo/type/types/reactive/value/tools/condition"
  );
  const { Effect } = await import("@/rollo/type/types/reactive/tools/effect");

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

  /* Reusable effect */
  (() => {
    const state_1 = Value();
    const state_2 = Value();
    const effect = (change) => {
      ////console.log('change:', change);////
      change.owner.detail.value = change.data.current;
      change.owner.detail.session = change.session;
    };
    /* Register effects */
    state_1.effects.add(effect);
    state_2.effects.add(effect);
    /* Update values */
    const foo = "foo";
    const bar = "bar";
    state_1.$ = foo;
    state_1.$ = foo;
    state_2.$ = bar;
    state_2.$ = bar;
    /* Check that effects ran correctly */
    test(foo, state_1.detail.value);
    test(0, state_1.detail.session);
    test(bar, state_2.detail.value);
    test(0, state_2.detail.session);
  })();

  /* Use of detail */
  (() => {
    const state = Value(0);
    state.effects.add((change) => {
      ////console.log('change:', change);////
      change.owner.detail.result = change.data.previous + change.data.current;
    });
    state.$ = 1;
    state.$ = 2;
    state.$ = 3;
    test(5, state.detail.result);
  })();

  /* Higher-order and self-deregistering effect */
  (() => {
    const HOT = 42;
    const state = Value();
    const effect = (change) => {
      ////console.log("change:", change);////
      change.owner.detail.effect_ran = true;
    };
    state.effects.add((change) => {
      ////console.log("change:", change);////
      if (change.data.current === HOT) {
        change.owner.effects.add(effect);
        change.owner.effects.remove(change.effect);
      }
    });
    state.$ = HOT;
    state.effects.call();
    test(true, state.detail.effect_ran);
    test(1, state.effects.size());
  })();

  /* Conditional effect */
  (() => {
    const state = Value(null, {}, function () {
      this.effects.add(
        Effect(
          (change) => {
            ////console.log("change:", change); ////
            ++change.effect.detail.count;
            if (!change.effect.condition(change)) {
              console.error(`Effect should not have run!`);
            }
          },
          (change) => change.data.current % 2 === 0,
          { detail: { count: 0 } }
        )
      );
    });
    const VALUES = Object.freeze([1, 2, 3, 4, 5]);
    VALUES.forEach((value) => (state.$ = value));
    test(
      VALUES.reduce(
        (accumulator, current) =>
          current % 2 === 0 ? ++accumulator : accumulator,
        0
      ),
      state.effects.effects()[0].detail.count
    );
  })();

  /* Conditional effect with short-hand */
  (() => {
    const HOT = 42;
    const state = Value(null, {}, function () {
      this.effects.add(
        Effect((change) => {
          ////console.log("change:", change); ////
          change.owner.detail.effect_ran = true;
          if (change.data.current !== HOT) {
            console.error(`Effect should not have run!`);
          }
        }, Condition.create(HOT))
      );
    });
    state.$ = "foo";
    state.$ = HOT;
    test(true, state.detail.effect_ran);
  })();

  /* Effect that changes current */
  (() => {
    const value = 42;
    const state = Value();
    state.effects.add((change) => {
      change.owner.current = value;
    });
    /* Trigger effects */
    state.effects.call();
    test(value, state.current);
  })();

  /* Immediately run effect */
  (() => {
    const value = 42;
    const state = Value(value);
    state.effects.add(
      (change) => {
        //console.log("change:", change); ////
        test(value, change.data.current);
      },
      true
    );
  })();

  /* Custom effect type for automatic triggering */
  (() => {
    const HOT = 42;
    const state = Value();
    /* Create default effect that triggers custom 'size' effects */
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      const current = change.data.current;
      const previous = change.data.previous;
      if (current === HOT) {
        change.owner.effects.call({ current, previous }, "hot");
      }
    });
    /* Create custom 'hot' effect */
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      /* Make it possible to check that effect was called */
      change.owner.detail.custom_effect_ran = true;
      /* Check that effect only runs, when size change */
      const current = change.data.current;
      if (current !== HOT) {
        console.error(`Effect incorrectly triggered.`);
      }
    }, "hot");
    state.$ = HOT;
    test(true, state.detail.custom_effect_ran);
  })();

  /* Custom effect type for explicit triggering */
  (() => {
    const state = Value(null, { detail: { count: 0 } });
    /* Create custom 'xfoo' effect */
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      /* Make it possible to check number of times effect was called */
      ++change.owner.detail.count;
    }, "foo");

    state.effects.call("FOO", "foo");
    test(1, state.detail.count);
  })();

  /* Use of effect result */
  (() => {
    const state = Value();
    state.effects.add((change) => {
      //console.log("change:", change); ////
      return 2*change.data.current
    });

    
    test(4, state.update(2));


  })();
})();
