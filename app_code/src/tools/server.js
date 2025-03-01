// import { server } from "@/tools/server";
// const { server } = await import("@/tools/server");
//  https://cdn.jsdelivr.net/gh/uffeat/testapp8@1.0.0-beta/app_code/src/tools/server.js


import origins from "@/meta/origins";

const origin = origins.development;






const BASE = `${origin}/_/api`;

/* Returns result from server endpoint. */
async function Server(name, data = {}, { meta = false, raw = false } = {}) {
  let time;
  /* Add meta */
  if (meta) {
    time = Date.now();
    data.__meta__ = { submission: create_submission() };
  }
  /* Prepare url and options */
  const url = `${BASE}/${name}`;
  const options = {
    headers: { "content-type": "text/plain" },
    method: "POST",
    body: JSON.stringify(data),
  };
  /* Submit request and get response */
  const response = await fetch(url, options);
  /* Parse response */
  if (raw) {
    /* NOTE
    - Raw results never contain request meta.
    - Raw results does not check for errors.
    */
    const result = await response.text();
    return result;
  }
  const result = await response.json();
  /* Check for error cue */
  if ("__error__" in result) {
    throw new Error(result.__error__);
  }
  /* Rearrange and complete meta */
  if (meta) {
    result.__meta__ = {
      duration: {
        total: Date.now() - time,
      },
      name,
      submission: data.__meta__.submission,
    };
  }
  return result;
}

/* Resets submission. */
export const reset = () => (submission = 0);

/* Returns result from server endpoint, proxy-version. */
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

let submission = 0;
/* Returns unique submission id. */
const create_submission = () => submission++;
