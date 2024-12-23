import "./bootstrap.scss";
import "./main.css";

await (async () => {
  

  const { Data } = await import("rollo/type/types/data/data");



  const data = Data.create({
    foo: "foo",
    bar: "bar",
    stuff: 42,
    thing: 42,

    name: 'uffe'
  });

  data.update({ foo: "FOO", bar: "BAR"});


  console.log('Can be json:', data.jsonable)


  console.log('sorted json:', data.json(true))

 





  console.log("data:", data);
  console.log(`data: ${data}`);

  //console.log("name:", data.name);
 


  console.log("data.data:", data.data);
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
