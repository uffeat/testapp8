import { anvil } from "@/rolloanvil/anvil.js";
await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");



const iframe = await (async () => {
  const { promise, resolve } = Promise.withResolvers();
  const iframe = component.iframe("anvil", {
    src: anvil.URL,
    "@load$once": (event) => {
      console.log('Loaded')//
      resolve()
    },
    parent: app,
    slot: 'anvil'
  });
  await promise;

  const submission = (() => {
    let submission = 0;
    return () => submission++;
  })();

  iframe.call = async (name, data = {}) => {
    const _submission = submission();
    const { promise, resolve } = Promise.withResolvers();
    iframe.contentWindow.postMessage(
      { name, meta: { submission: _submission }, data },
      anvil.URL
    );

    const response = (event) => {
      const data = event.data || {};
      const meta = data.meta || {};
      if (meta.submission !== _submission) return;
      resolve(data.data || {});
      window.removeEventListener("message", response);
    };
    window.addEventListener("message", response);
    return promise;
  };
  return iframe;
})();

/* Test */
const response = await iframe.call("foo", { number: 42 });
console.log("response:", response);
