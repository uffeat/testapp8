import "@/rollotest/__init__.js";

document.querySelector("html").dataset.bsTheme = "dark";

console.info("Environment:", meta.env.name);

const worker = async () => {
  const worker = new (class {
    #_ = {
      iframe: component.iframe({
        parent: document.head,
        src: meta.anvil.origin,
      }),
      handshake: (event) => {},
      submission: 0,
      timeout: 3000
    };

    constructor() {}

    async load() {
      const { promise, resolve, reject } = Promise.withResolvers();
      this.#_.iframe.on.load$once = (event) => {
        resolve();
      };
      console.log("iframe loaded."); ////
      await promise;
    }

    async handshake() {
      const owner = this
      const { promise, resolve, reject } = Promise.withResolvers();

      new (class {
        #_ = {};
        constructor() {
          this.#_.timer = setTimeout(
              () => {
                const error = new Error(`Handshake did not complete in time.`);
                if (meta.env.DEV) {
                  reject(error);
                } else {
                  resolve(error);
                }
                window.removeEventListener("message", this.onmessage);
              },
              3000
            );
          window.addEventListener("message", this.onmessage);
        }

        get timer() {
          return this.#_.timer;
        }

        onmessage = async (event) => {
          if (meta.anvil.origin !== event.origin) {
            return;
          }
         
          this.timer && clearTimeout(this.timer);
          if (meta.env.DEV) {
            console.info(`Anvil worker ready.`);
          }


          console.log('Got handshake back')
          
          window.removeEventListener("message", this.onmessage);
          resolve();

          
        };
      })();

      console.log('Sending handshake')
      this.#_.iframe.contentWindow.postMessage(this.origin);

      await promise
    }

    async call(name, data) {
      iframe.contentWindow.postMessage({
        submission: 1,
        name,
        data,
      });
    }
  })();

  await worker.load();
  await worker.handshake();

  window.addEventListener("message", (event) => {
    if (
      event.origin !== meta.anvil.origin ||
      event.data.submission === undefined
    ) {
      return;
    }
    console.log("event:", event);
  });

  return worker.call;
};

const w = await worker();
