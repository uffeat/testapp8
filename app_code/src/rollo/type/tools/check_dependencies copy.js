/* Checks dependencies */
export function check_dependencies(dependencies, factories) {
  const missing = new Set(dependencies).difference(new Set(factories));
  if (missing.size > 0) {
    const names = Array.from(missing).map((factory) => factory.name);
    throw new Error(`Missing dependencies: ${names}`);
  }
}