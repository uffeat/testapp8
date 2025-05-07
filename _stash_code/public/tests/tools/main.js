const link = document.createElement("link");
link.rel = "stylesheet";
link.href = `${location.origin}/app_code/public/tests/tools/main.css`;
const { promise, resolve } = Promise.withResolvers();
const on_load = (event) => {
  link.removeEventListener("load", on_load);
  resolve();
};
link.addEventListener("load", on_load);
document.head.append(link);
await promise;

const path = location.pathname
  .split("/public/tests/")
  .reverse()[0]
  .slice(0, -".html".length);

  let title = document.head.querySelector('title')
  if (!title) {
    title = document.createElement('title')
    document.head.append(title)


  }
  title.textContent = path



const iframe = document.createElement("iframe");
iframe.src = `http://localhost:5173/#${path}`;

document.body.append(iframe);
