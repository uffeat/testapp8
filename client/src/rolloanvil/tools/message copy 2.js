/*
import { Message } from "@/rolloanvil/tools/message.js";
*/

export class Message {
  #_ = {};
  constructor(event, context = {}) {
    this.#_.event = event;

    this.#_.origin = event.origin;
    this.#_.source = event.source;

    this.#_.data = event.data?.data || null;

   
    
    
    this.#_.meta = Object.freeze(event.data?.meta || {});

    this.#_.context = Object.freeze(context);
  }

  /* Returns context. */
  get context() {
    return this.#_.context;
  }

  /* Returns data. */
  get data() {
    return this.#_.data;
  }

  /* Returns event. */
  get event() {
    return this.#_.event;
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

  /* */
  validate() {

    //console.log("meta:", this.meta); //


    if ("origin" in this.context && this.origin !== this.context.origin) {
      console.log("Invalid origin:", this.origin); //
      return false;
    }

    

    if (!this.meta.name) {
      console.log("no name"); //
      return false;
    }
    

    if ("name" in this.context && this.meta.name !== this.context.name) {
      console.log("Invalid name:", this.meta.name); //
      return false;
    }

    if (this.meta.submission === null) {
      console.log("no submission"); //
      return false;
    }

    

    if ("submission" in this.context && this.meta.submission !== this.context.submission) {
      console.log("Invalid submission:", this.meta.submission); //
      return false;
    }

    return true;
  }
}
