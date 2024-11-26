export function use_hooks(hooks) {
  return function () {
    if (hooks) {
      hooks.forEach((hook) => {
        hook.call(this);
      });
    }
  };
}