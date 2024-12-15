// css_static

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

  const my_sheets = create("css-sheets", { name: "my_sheets", parent: root });
  const my_sheet = create("css-sheet", { name: "my_sheet", parent: my_sheets });
  const my_static = create("css-static", {
    name: "my_static",
    parent: my_sheet,
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
  });

  //my_static.remove()
  //my_sheet.remove()
  //my_sheets.append(my_sheet)
  //const style_element = my_static.clone()
  //root.append(style_element)
})();
