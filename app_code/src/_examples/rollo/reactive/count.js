await (async () => {
  const { Reactive } = await import("@/rollo/reactive/reactive_object");
  const { Value } = await import("@/rollo/reactive/reactive_value");
  const { component } = await import("rollo/component/component");

  component.button("btn.btn-primary", { parent: app }, (button) => {
    const state = Value(
      0,
      ({ current }) => (button.text = `Count: ${current}`)
    );
    button.on.click = () => ++state.current;
  });

  component.button("btn.btn-primary", { parent: app }, (button) => {
    const state = Reactive(
      { count: 0 },
      ({ current }) => (button.text = `Count: ${current.count}`)
    );
    button.on.click = () => ++state.$.count;
  });
})();