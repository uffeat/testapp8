import "./bootstrap.scss";
import "./main.css";



/* Purpose: Demonstate and test 'update' */
await (async () => {


  console.dir(window.location)

  


  async function construct_module(js) {
    const blob = new Blob([js], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const js_module = await new Function(`return import("${url}")`)();
    URL.revokeObjectURL(url);
    return js_module;
  }

  async function construct_module_from_url(url) {
    
    const js_module = await new Function(`return import("${url}")`)();
   
    return js_module;
  }


  let url = new URL('public/test.js', import.meta.url).href
  console.log(url)


  const js_module = await(construct_module_from_url(url))
  console.dir(js_module)


  


 




})();

/* Enable tests */
/*
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
  */
