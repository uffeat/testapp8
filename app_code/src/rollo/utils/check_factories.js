export const check_factories = (required, factories) => {
  const missing = new Set(required).difference(new Set(factories));
  if (missing.size > 0) {
    throw new Error(`Missing factories: ${Array.from(missing)}`);
   
  }
};