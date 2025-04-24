/* Tests, if two numbers are close enough to be deemed equal
- based on absoulte and relative tolerances.
Default tolerances are suitable for handling typical monetary cases.  */
export const match = (value, other, { abs = 1e-4, rel = 1e-6 } = {}) => {
  if (value === other) return true;
  const diff = Math.abs(value - other);
  return diff <= abs || diff <= Math.max(Math.abs(value), Math.abs(other)) * rel;
}