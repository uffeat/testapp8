/*
import { Message } from "@/rolloanvil/tools/message.js";
*/

/* Util for managing message event props. */
export class Message {
  #_ = {};
  constructor(event) {
    this.#_.event = event;

    this.#_.origin = event.origin;
    this.#_.source = event.source;

    this.#_.data = event.data?.data || null;
    this.#_.result = event.data?.result || null;

    this.#_.id = event.data?.id || null;

    this.#_.submission = event.data?.submission;

    this.#_.meta = Object.freeze(event.data?.meta || {});
  }

  /* Returns result. */
  get data() {
    return this.#_.data;
  }

  /* Returns result. */
  get result() {
    return this.#_.result;
  }

  /* Returns event. */
  get event() {
    return this.#_.event;
  }

  /* Returns id. */
  get id() {
    return this.#_.id;
  }

  /* Returns meta. */
  get meta() {
    return this.#_.meta;
  }

  /* Returns origin. */
  get origin() {
    return this.#_.origin;
  }

  /* Returns source. */
  get source() {
    return this.#_.source;
  }

  /* Returns submission. */
  get submission() {
    return this.#_.submission;
  }
}
