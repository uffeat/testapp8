import "./main.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter";
import { html } from "./utils/html";

//import { import_txt } from "./import_txt";
//const my_html = await import_txt("main.html");
//console.log(my_html);


async function run_test(path) {
  if (import.meta.env.DEV) {
    await import(`./tests/${path}.js`);
  }
}

await run_test('foo')


document.querySelector("#root").innerHTML = html`
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
      target="_blank"
    >
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">Click on the Vite logo to learn more</p>
  </div>
`;

setupCounter(document.querySelector("#counter"));
