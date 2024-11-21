export const add_constructor_name = (constructor) => {
  return (...args) => {
    const component = constructor(...args);
    component.dataset.constructorName = constructor.name;
    return component;
  };
};