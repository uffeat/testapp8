/*
 rollobs/scratch
*/

const { MyComponent } = await use("@/rollobs/components/my_component/");

const my_component = MyComponent({ parent: document.body });

my_component.state.update({text: "It works!"})

