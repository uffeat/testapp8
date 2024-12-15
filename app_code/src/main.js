import "./bootstrap.scss";
import "./main.css";

const { create } = await import("rollo/component");
await import("rollo/components/css/css_frames");
await import("rollo/components/css/css_frame");
await import("rollo/components/css/css_media");
await import("rollo/components/css/css_rule");
await import("rollo/components/css/css_sheet");
await import("rollo/components/css/css_sheets");

const root = create("div", {
  id: "root",
  parent: document.body,
});

await (async () => {
  const { create } = await import("rollo/component");
  await import("rollo/components/css/css_sheet");
  await import("rollo/components/css/css_sheets");
  await import("rollo/components/css/css_static");

  if (!root) {
    create("div", {
      id: "root",
      parent: document.body,
    });
  }

  /* Create elements to test css on */
  create("h1", { parent: root }, "Hello World");
  create("h2", { parent: root }, "Also hello from here");

  create(
    "css-sheets",
    { name: "my_sheets", parent: root },
    create(
      "css-sheet",
      { name: "my_sheet" },
      create("css-static", {
        name: "my_static",
        config: {
          h1: {
            color: "pink",
            backgroundColor: "linen",
            padding: "8px",
            animationDuration: "3s",
            animationName: "slide_in",
          },
          h2: { color: "blue" },
          "@keyframes slide_in": {
            "0%": { translate: "150vw 0", scale: "200% 1" },
            "100%": { translate: "0 0", scale: "100% 1" },
          },
          "@media (max-width: 300px)": { h2: { color: "red" } },
        },
      })
    )
  );
  const my_sheet = document.querySelector(`css-sheet[name="my_sheet"]`);
  const my_static = document.querySelector(`css-static[name="my_static"]`);

  create(
    "menu",
    { parent: root, display: "flex", padding: "4px", columnGap: "8px" },
    create("button", {
      text: "Do stuff",
      on_click: (event) => {
        console.log("clicked");
      },
    }),
    create("button", { text: "Do stuff" })
  );

  //my_static.remove()
  //my_sheet.remove()
  //my_sheets.append(my_sheet)
  //const style_element = my_static.clone()
  //root.append(style_element)
})();

/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
