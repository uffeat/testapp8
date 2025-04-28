import { anvil } from "@/rolloanvil/anvil.js";

const api_origin = `${anvil.URL}/_/api`;
const options = {
  headers: { "content-type": "text/plain" },
  method: "POST",
};
const SUBMISSION = 'submission'

/* Returns result from server endpoint. 
NOTE
- raw -> Result as text, no error check.
*/
async function Server(name, data = {}, { raw = false } = {}) {
  if (SUBMISSION in data) {
    throw new Error(`'${SUBMISSION}' is a reserved word.`)
  }
  options.body = JSON.stringify(data);
  /* NOTE
  - Add the submission query item not only provides useful meta data, 
    but also ensures busting of any silent browser caching. */
  const response = await fetch(`${api_origin}/${name}?${SUBMISSION}=${create_submission()}`, options);
  if (raw) {
    return response.text();
  }
  const result = await response.json();
  /* Check for error cue */
  if ("__error__" in result) {
    throw new Error(result.__error__);
  }
  return result;
}

/* Returns result from server endpoint, proxy-version 
(syntactical alternative). */
export const server = new Proxy(
  {},
  {
    get: (_, name) => {
      return (...args) => {
        return Server(name, ...args);
      };
    },
  }
);

const create_submission = (() => {
  let submission = 0
  return () => submission++
})();

/* EXAMPLES

await (async () => {
  const { server } = await import("@/rolloanvil/server.js");

  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };
  
  const result = await server.foo(data);
  console.log("result:", result);
  
  const raw = await server.foo(data, { raw: true });
  console.log("raw:", raw);
  
})();

*/
