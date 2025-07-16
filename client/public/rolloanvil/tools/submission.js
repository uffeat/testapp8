/*
*/

export const Submission = new (class {
  #_ = {
    submission: 0,
  };

  create() {
    return this.#_.submission++;
  }
})();