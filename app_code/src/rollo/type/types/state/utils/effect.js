/* Argument for effect handlers */
export class Effect {
  constructor(owner) {
    
    this.#owner = owner;
   
  }

 

  /* Returns owner. */
  get owner() {
    return this.#owner;
  }
  #owner;


}
