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

    this.#_.channel = event.data?.channel || null;
    this.#_.data = event.data?.data || null;
    this.#_.error = event.data?.error || null;
    this.#_.id = event.data?.id || null;
    this.#_.result = event.data?.result || null;
    //this.#_.submission = event.data?.submission
    /* NOTE Use ternary to correctly handle submission=0 */
    this.#_.submission = 'submission' in event.data ? event.data.submission : null

    this.#_.meta = Object.freeze(event.data?.meta || {});
  }

  /* Returns channel. */
  get channel() {
    return this.#_.channel;
  }

  /* Returns data (data item in event.data). */
  get data() {
    return this.#_.data;
  }

  /* Returns error . */
  get error() {
    return this.#_.error;
  }

  /* Returns event. */
  get event() {
    return this.#_.event;
  }

  /* Returns id. */
  get id() {
    return this.#_.id;
  }

  /* Returns origin. */
  get origin() {
    return this.#_.origin;
  }

  /* Returns result. */
  get result() {
    return this.#_.result;
  }

  /* Returns source. */
  get source() {
    return this.#_.source;
  }

  /* Returns submission. */
  get submission() {
    return this.#_.submission;
  }



  /* Returns meta. */
  get meta() {
    return this.#_.meta;
  }
}
