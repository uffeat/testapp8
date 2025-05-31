export const define = (tag, cls) => {
  tag = `rollo-${tag.toLowerCase()}`;
  customElements.define(tag, cls);
  if (import.meta.env.DEV) {
    console.info("Registered component with tag:", tag);
  }
  return cls
};
