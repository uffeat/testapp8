/*

*/

export class Listener {
  #_ = {};

  constructor({
    data,
    name,
    options = {},
    owner,
    reject,
    resolve,
    submission,
  }) {
    this.#_.data = data;
    this.#_.name = name;
    this.#_.owner = owner;
    this.#_.submission = submission;
    this.#_.options = options;
    this.#_.reject = reject;
    this.#_.resolve = resolve;

    if (![false, null].includes(this.options.timeout)) {
      this.#_.timer = setTimeout(
        () => {
          const error = new Error(
            `'${name}' did not respond in time for submission: ${this.submission}.`
          );
          if (import.meta.env.DEV) {
            this.reject(error);
          } else {
            this.resolve(error);
          }
          window.removeEventListener("message", this.onmessage);
        },
        this.options.timeout === undefined
          ? this.owner.config.timeout
          : this.options.timeout
      );
    }

    this.#_.onmessage = (event) => {
      if (!event.data || !event.origin || !event.source) return;
      if (event.origin !== this.owner.src) return;
      if (!event.data.meta) return;
      if (event.data.meta.id !== this.owner.id) return;
      if (event.data.meta.submission !== this.submission) return;
      this.timer && clearTimeout(this.timer);
      if (event.data.meta.error) {
        this.reject(new Error(event.data.meta.error));
      } else {
        this.resolve(event.data.data || null);
      }
      window.removeEventListener("message", this.onmessage);
    };
    window.addEventListener("message", this.onmessage);
  }

  get data() {
    return this.#_.data;
  }

  get name() {
    return this.#_.name;
  }

  get onmessage() {
    return this.#_.onmessage;
  }

  get options() {
    return this.#_.options;
  }

  get owner() {
    return this.#_.owner;
  }

  get submission() {
    return this.#_.submission;
  }

  get reject() {
    return this.#_.reject;
  }

  get resolve() {
    return this.#_.resolve;
  }

  get timer() {
    return this.#_.timer;
  }
}
