import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

const Submission = new (class {
  #_ = {
    submission: 0,
  };

  create() {
    return this.#_.submission++;
  }
})();

const worker = component.iframe({ parent: app, src: meta.anvil.origin });

await (async () => {
  const { promise, resolve } = Promise.withResolvers();
  worker.on.load$once = (event) => {
    resolve();
  };
  return promise;
})();

console.log("worker loaded");

const call_api = (api, data) => {
  const submission = Submission.create();
  const { promise, resolve } = Promise.withResolvers();

  function onmessage(event) {
    if (event.origin !== meta.anvil.origin) {
      return;
    }
    if (event.data.submission !== submission) {
      return;
    }
    window.removeEventListener("message", onmessage);
    resolve(event.data.result);
  }

  window.addEventListener("message", onmessage);
  worker.contentWindow.postMessage({ api, data, submission }, meta.anvil.origin);

  return promise;
};

call_api('echo', {echo: 'Oh, my echo!'}).then((result) => console.log(result))
