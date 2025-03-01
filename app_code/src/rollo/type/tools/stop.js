/* Non-error exception to signal iteration break. */
export class Stop extends Error {
  constructor() {
    super("");
    this.name = "Stop";
  }
}

/* Throws Stop error. */
export const stop = () => {
  throw new Stop();
}