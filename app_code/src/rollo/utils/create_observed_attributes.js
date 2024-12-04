export const create_observed_attributes = (parent, ...observedAttributes) => {
  return Array.from(
    new Set([...observedAttributes, ...parent.observedAttributes || []])
  );
}