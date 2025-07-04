await use("@/rollotest/");

document.querySelector("html").dataset.bsTheme = "dark";

console.info(
  "Environment:",
  import.meta.env.DEV ? "development" : import.meta.env.VERCEL_ENV
);

const { component } = await use("@/rollocomponent/");
const { AnvilModal } = await use("/components/anvil/modal.x.html");



const bar = await AnvilModal("bar");

component.menu('px-2.flex.gap-x-2',
  { parent: app },
  component.button("btn.btn-primary", { "@click": (event) => bar.show() }, 'Show'),
 
);


