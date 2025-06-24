await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");

const { promise, resolve } = Promise.withResolvers();

const anvil = component.iframe("anvil", {
  //src: "https://testapp8dev.anvil.app",
  src: '/anvil',

  "@load": (event) => resolve(),
  parent: app,
});

await promise

console.log('window:', anvil.contentWindow)
//console.log('document:', anvil.contentDocument)
