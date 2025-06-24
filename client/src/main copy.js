await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const anvil = await (async () => {
  const { promise, resolve } = Promise.withResolvers();
  const iframe = component.iframe("anvil", {
    src: "https://testapp8dev.anvil.app",
    "@load$once": (event) => resolve({}),
    parent: app,
  });

  await promise;

  const submission = (() => {
    let submission = 0;
    return () => submission++;
  })();

  iframe.call = async (name, data = {}) => {
    const __submission__ = submission();
    const { promise, resolve } = Promise.withResolvers();
    iframe.contentWindow.postMessage(
      { __name__: name, __submission__, ...data },
      "*"
    );

    const response = (event) => {
      const data = event.data;
      /* TODO
      - match submission */
      console.log('event:', event)
      console.log('data:', data)
      resolve(data);

      window.removeEventListener("message", response);
    };

    window.addEventListener("message", response);

    return promise;
  };

  return iframe;
})();

const response = anvil.call('foo', {'FOO': 42})
//.then((data) => console.log('data:', data))

console.log('response:', response)

