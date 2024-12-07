export const check_factories = (required, factories) => {
  const missing = new Set(required).difference(new Set(factories));
  if (missing.size > 0) {
    const names = Array.from(missing).map((factory) => factory.name)
    throw new Error(`Missing factories: ${names}`);
   
  }
};