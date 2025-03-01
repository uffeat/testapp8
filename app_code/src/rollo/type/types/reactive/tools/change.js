// import { Change } from "@/rollo/type/types/reactive/tools/change";
// const { Change } = await import("@/rollo/type/types/reactive/tools/change");

/* Returns argument for effects. */
export const Change = (...args) => {
  return new ChangeType(...args);
};

/* Argument for effects. */
export class ChangeType {
  static name = "ChangeType";

  #data;
  #detail = {};
  #effect = null;
  #index = null;
  #owner;
  #result = null;
  #sender = null;
  #session;
  #stop;
  #type;
  #time;

  constructor({
    data,
    detail,
    effect = null,
    owner,
    sender = null,
    session = null,
    stop,
    type = "",
  }) {
    this.#data = data;
    if (detail !== undefined) {
      this.#detail = detail;
    }
    this.#effect = effect;
    this.#owner = owner;
    this.#sender = sender;
    this.#session = session;
    this.#type = type;
    this.#stop = stop;
    this.#time = Date.now();
  }

  /* Returns data.*/
  get data() {
    return this.#data;
  }

  /* Returns detail. 
  NOTE
  - Useful for adding ad-hoc data to change argument, e.g., to enable 
    inter-effect communication or for testing.
  */
  get detail() {
    return this.#detail;
  }

  /* Returns effect. */
  get effect() {
    return this.#effect;
  }
  /* Sets effect. 
  NOTE
  - Can, but should generally not, be used externally.
  */
  set effect(effect) {
    this.#effect = effect;
  }

  /* Returns index. */
  get index() {
    return this.#index;
  }
  /* Sets index. 
  NOTE
  - Can, but should generally not, be used externally.
  */
  set index(index) {
    this.#index = index;
  }

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }

  /* Returns sender. */
  get sender() {
    return this.#sender;
  }

  /* Returns session id. */
  get session() {
    return this.#session;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  /* Returns timestamp. */
  get time() {
    return this.#time;
  }

  /* Returns result. */
  get result() {
    return this.#result;
  }
  /* Sets result. */
  set result(result) {
    this.#result = result;
  }

  /* Prevents call of subsequent effects in session. */
  stop() {
    this.#stop();
  }
}
