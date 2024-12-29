import { Effect } from "rollo/type/types/data/tools/effect";

/* Subscriptions controller.
NOTE
- Whereas an effect is typically registered on (and stored in) the reactive 
  target, the effect pertains to, the 'subscription' concept involves
  setting up an effect and storing the effect from another object 
  (with the reactive target as arg). Largely a syntactical alternative,
  registering effects via subscriptions can be semantically sound, e.g., 
  when the effect is primarily concerned with mutating the the target,
  the subscription is made from. Moreover, subscriptions makes it possible
  to set up effects by variable assignment. 
 */
export class Subscriptions {
  static create = (...args) => new Subscriptions(...args);

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns subscription registry. Stores publisher-effect parirs.
  NOTE
  - Can, but should generally not, be changed externally. 
  */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of subscriptions. */
  get size() {
    return this.registry.size;
  }

  /* Add subscription. */
  add(publisher, source, condition) {
    /* Create effect */
    /* NOTE
    - 'source' is bound to the subscribing target, when added to effect.
      It can be handy to have a ref to the subscribing target inside the 
      effect source. There's no such need re the effect target, since it's 
      explicitly passed into the source.
    */
    const effect = Effect.create(source.bind(this.owner), condition);
    /* Store publisher and effect for later removal */
    this.registry.set(publisher, effect);
    /* Register effect */
    effect.register(publisher);
    /* Return publisher for later removal */
    return publisher
  }

  /* Removes all subscriptions. */
  clear() {
    for (const [publisher, effect] of this.registry.entries()) {
      effect.deregister(publisher);
    }
    this.registry.clear();
  }

  /* Tests, if subscribes. */
  has(publisher) {
    return this.registry.has(publisher);
  }

  /* Removes subscription. */
  remove(publisher) {
    /* Retrieve effect */
    const effect = this.registry.get(publisher);
    if (effect) {
      /* Deregister effect */
      effect.deregister(publisher);
    }
    /* Remove publisher form storage */
    this.registry.delete(publisher);
  }
}
