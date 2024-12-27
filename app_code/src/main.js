import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test effects */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

 

  data.effects.add((current) => {
    console.log('foo:', current.current.foo)
  }, 'foo')

  const publisher = Data.create({
    a: 1,
    b: 2,
    c: 3,
  });

  class Subscription {
    static create = (...args) => new Subscription(...args);
    #effect;
    constructor(subscriber, key, publisher, ...reducers) {
      this.#key = key;
      this.#publisher = publisher;
      this.#reducers = reducers;
      this.#subscriber = subscriber;

      this.#effect = publisher.effects.add(
        ({ current, previous, publisher, session }) => {

          
          /* Perhaps do not use 'reduce', but rely on passed-in unbound func, 
          to which publisher and subscriber are passed in??? */



          subscriber[key] = publisher.reduce(...reducers);
        }
      );
    }

    get disabled() {
      return this.#disabled;
    }
    set disabled(disabled) {
      /* TODO
      -
      */
      this.#disabled = disabled;
    }
    #disabled;

    

    get key() {
      return this.#key;
    }
    #key;

    get publisher() {
      return this.#publisher;
    }
    #publisher;

    get reducers() {
      return this.#reducers;
    }
    #reducers;

    get subscriber() {
      return this.#subscriber;
    }
    #subscriber;
  }

  /* Perhaps the passed in function should decide, which key in subscriber should be targetted?
  This could handle multiple keys and would slim-down the Subscription.create signature */

  const supscription = Subscription.create(data, "foo", publisher, function() {
    let sum = 0
    this.values.forEach(v => sum += v);
    return sum
  });

  publisher.a = 10





})();
0;

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`@/tests/${path}.js`);
    }
  });
}
