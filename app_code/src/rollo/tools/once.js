export const once = (source, callback) => {
  let ran;

  function wrapper(...args) {
    if (!ran) {
      ran = true;
      const result = source.call(this, ...args);
      if (callback) {
        callback.call(this, wrapper, ...args);
      }
      return result;
    }
  }

  wrapper._source = source;

  return wrapper;
};
