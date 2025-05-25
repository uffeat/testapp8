/* 

*/

export const required = (parent, config, ...factories) => {
  return class extends parent {
    static name = "required";

    /* Returns 'required'. */
    get required() {
      return this.attribute.required || false;
    }
    /* Sets 'required'. */
    set required(required) {
      const { input } = this.__elements__;
      this.attribute.required = input.required = required;
      this?.validate();
    }
  };
};
