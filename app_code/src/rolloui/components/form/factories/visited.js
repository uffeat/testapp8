/* 

*/

export const visited = (parent, config, ...factories) => {
  return class extends parent {
    static name = "visited";

    /* Returns 'visited' flag. */
    get visited() {
      return this.attribute.visited ? true : false;
    }
  };
};
