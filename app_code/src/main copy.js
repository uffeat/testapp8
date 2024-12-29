import "./bootstrap.scss";
import "./main.css";

/* Purpose: Demonstate and test 'update' */
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");

  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
  });

  /* Set up effect to check batch-updates. */
  data.effects.add((change) => {});

  function my_func(stuff = function stuff() {}, ...args) {
    console.log("args:", args);
    const foo = {foo: 'foo'}
    console.log("stuff");
    return 42;
  }

  const my_arrow = (...args) => {
    console.log("args:", args);
    console.log("stuff");
    return 42;
  }

  const text = String(my_func);
  //console.log(text);

  const constructed = Function('...args', `return (${text})(...args)`)
  //console.log('result:', constructed('stuff'))

  function to_object(func) {
    const result = {name: func.name}

    //console.log('constructor:', func.constructor)

    const text = String(func);
    let [head, ...declaration] = text.split('(')
    declaration = `(${declaration.join()}`
    console.log('declaration:', declaration)

   







    return result
  }

  to_object(my_func)


 




})();

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
