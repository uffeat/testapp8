import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

const Worker = new (class {
  #_ = {
    loaders: new Map(),
  };

  constructor() {
    this.#_.Submission = new (class {
      #_ = {
        submission: 0,
      };

      create() {
        return this.#_.submission++;
      }
    })();

    this.#_.iframe = component.iframe({
      parent: document.head,
      src: meta.anvil.origin,
    });
  }

  async use(api) {
    if (!this.#_.loaded) {
      await this.#load();
      this.#_.loaded = true;
    }

    if (this.#_.loaders.has(api)) {
      return this.#_.loaders.get(api);
    }

    const loader = (data) => {
      return this.#call(api, data);
    };

    this.#_.loaders.set(api, loader)
    return loader


  }

  #call(api, data) {
    const submission = this.#_.Submission.create();
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
    this.#_.iframe.contentWindow.postMessage(
      { api, data, submission },
      meta.anvil.origin
    );

    return promise;
  }

  #load() {
    const { promise, resolve } = Promise.withResolvers();
    this.#_.iframe.on.load$once = (event) => {
      resolve();
    };
    return promise;
  }
})();


const echo = await Worker.use("echo");
echo({ echo: "echo!echo" }).then((result) => console.log(result));



