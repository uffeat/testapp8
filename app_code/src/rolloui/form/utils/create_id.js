export const create_id = (() => {
  let count = 0;
  return () => {
    return `${count++}`;
  };
})();
