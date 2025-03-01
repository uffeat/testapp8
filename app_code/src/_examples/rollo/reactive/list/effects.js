/* Primary purpose: Test and demo of effect, incl.
- reusable effect functions
- use of change.detail
- use of change.index
- use of change.session
- breaking effects
- higher-order and self-deregistering effects
- conditional effects
- effects that change current
- immediately run effects
- custom effect types
- explicit triggering of effects
- use of effect results
Also features
- has
- detail
- size
*/
await (async () => {
  const { List } = await import("@/rollo/type/types/reactive/list/list");
  const { Effect } = await import("@/rollo/type/types/reactive/tools/effect");
  const { Condition } = await import(
    "@/rollo/type/types/reactive/list/tools/condition"
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

  /* Reusable effect functions and use of detail */
  (() => {
    const state_0 = List(null, { detail: { sum: 0 } });
    const state_1 = List(null, { detail: { sum: 0 } });

    const effect = (change) =>
      change.data.added.forEach((v) => (change.owner.detail.sum += v));

    state_0.effects.add(effect);
    state_1.effects.add(effect);

    state_0.add(1, 2, 3);
    state_1.add(10, 20, 30);

    test(6, state_0.detail.sum);
    test(60, state_1.detail.sum);
  })();

  /* Use of detail, change.detail, and change.index
    NOTE
    - Just to demo possibilities; result can be achieved more efficiently by 
    other means. */
  (() => {
    const state = List(null, { detail: { result: 0 } });

    state.effects.add(
      /* Update change.detail from change.data.added */
      (change) => (change.detail.result = 2 * change.data.added[0])
    );
    state.effects.add(
      /* Update change.detail from itself and change.index */
      (change) =>
        (change.detail.result = 2 * change.detail.result + change.index)
    );
    state.effects.add(
      /* Update change.owner.detail from change.detail and change.index */
      (change) =>
        (change.owner.detail.result = change.detail.result + change.index)
    );
    /* Run effects pipe */
    state.add(2);

    test(11, state.detail.result);
  })();

  /* Use of detail and change.session  */
  (() => {
    const state = List(null, {
      detail: { result: 0 },
      effects: [
        (change) => {
          if (change.session === 2) {
            change.owner.current.forEach(
              (v) => (change.owner.detail.result += v)
            );
            change.owner.effects.remove(change.effect);
          }
        },
      ],
    });

    state.add(1);
    state.add(2);
    state.add(3);
    state.add(100);

    test(6, state.detail.result);
  })();

  /* Breaking effect */
  (() => {
    const state = List(null, { detail: { index: null } });

    state.effects.add((change) => (change.owner.detail.index = change.index));
    state.effects.add((change) => {
      change.owner.detail.index = change.index;
      change.stop();
    });
    state.effects.add((change) => {
      change.owner.detail.index = change.index;
      console.error(`Effect should not run`);
    });

    state.add(2);
    state.add(3);
    test(1, state.detail.index);
  })();

  /* Higher-order and self-deregistering effects */
  (() => {
    const state = List(null, { detail: { result: null } });

    const effect = (change) => {
      ////console.log("change:", change);////
      change.owner.detail.result = true;
    };

    state.effects.add((change) => {
      if (change.owner.has(42)) {
        change.owner.effects.add(effect);
        change.owner.effects.remove(change.effect);
      }
    });

    state.add(2);
    state.add(42);
    state.add(100);

    test(true, state.detail.result);
    test(1, state.effects.size());
  })();

  /* Conditional effects */
  (() => {
    const state = List(null, { detail: { result: [] } });

    const requirement = [42, true];

    const effect = Effect((change) => {
      ////console.log("change:", change); ////
      const filtered = change.data.added.filter((v) => requirement.includes(v));
      if (filtered.length) {
        success();
        change.owner.detail.result.push(...filtered);
      } else {
        console.error("change.data.added does not include", 42, "nor", true);
      }
    });
    effect.condition = Condition.create(requirement);
    // Alternatively
    //effect.condition = (change, effect) => change.data.added.includes(42) || change.data.added.includes(true);
    state.effects.add(effect);

    state.add(2);
    state.add(42, 100);
    state.add(true);

    if (List(requirement).match(state.detail.result)) {
      success();
    } else {
      error(requirement, state.detail.result);
    }
  })();

  /* Effect that changes current */
  (() => {
    const state = List();

    state.effects.add((change) => {
      change.owner.add(42);
    });

    /* Trigger effects */
    state.effects.call();

    test(42, state.current[0]);
  })();

  /* Immediately run effect */
  (() => {
    const state = List([1, 2]);
    state.remove(1);

    state.effects.add(
      (change) => {
        ////console.log("change:", change); ////
        test(2, change.data.added[0]);
        test(1, change.data.removed[0]);
      },
      true
    );
  })();

  /* Custom effect type for automatic triggering */
  (() => {
    const state = List();

    /* Create default effect that triggers custom 'size' effects */
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      const current = change.owner.size;
      const previous = change.owner.previous.length;
      if (current !== previous) {
        change.owner.effects.call({ current, previous }, "size");
      }
    });

    /* Create custom 'size' effect */
    state.effects.add((change) => {
      ////console.log("change:", change); ////
      /* Make it possible to check that effect was called */
      change.owner.detail.custom_effect_ran = true;
      /* Check that effect only runs, when size change */
      const current = change.data.current;
      const previous = change.data.previous;
      if (current === previous) {
        console.error(`Effect incorrectly triggered.`);
      }
    }, "size");

    state.add(1, 2, 3);
    state.update({ add: [4], remove: [1] });
    state.remove(2);

    test(true, state.detail.custom_effect_ran);
  })();

  /* Custom effect type for explicit triggering */
  (() => {
    const state = List(null, { detail: { count: 0 } });

    /* Create custom 'foo' effect */
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
    const state = List();

    state.effects.add((change) => {
      ////console.log("change:", change); ////
      const sum = change.owner.current.reduce(
        (accumulator, current) => accumulator + current,
        0
      );
      return sum;
    });

    test(6, state.update({ add: [1, 2, 3] }));
  })();
})();
