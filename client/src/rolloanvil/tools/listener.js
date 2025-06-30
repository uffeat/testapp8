/*
import { Listener } from "@/rolloanvil/tools/listener.js";
*/
import { Message } from "@/rolloanvil/tools/message.js";

export class Listener {
  #_ = {};

  constructor({
    name,
    options = {},
    owner,
    reject,
    resolve,
    submission,
  }) {
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
            `'${this.name}' did not respond in time for submission: ${this.submission}.`
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
      const message = new Message(event, {
        id: this.owner.id,
        origin: this.owner.src,
        submission: this.submission,
      });

      if (!message.validate()) return;

      this.timer && clearTimeout(this.timer);
      if (message.meta.error) {
        this.reject(new Error(message.meta.error));
      } else {
        this.resolve(message.data);
      }
      window.removeEventListener("message", this.onmessage);
    };
    window.addEventListener("message", this.onmessage);
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
