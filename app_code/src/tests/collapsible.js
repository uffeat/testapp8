// collapsible

await (async () => {
  const { create } = await import("rollo/component");
  const { Collapsible } = await import("rolloui/Collapsible");
  const { Menu } = await import("rolloui/Menu");

  const collapsible = Collapsible(
    {
      parent: root,
      open: true,
    },
    create("h1.text-bg-primary.p-3", {}, "Foo")
  );
  collapsible.on_showing = (data) => console.log("Showing...");
  collapsible.on_shown = (data) => console.log("Shown!");
  collapsible.on_hiding = (data) => console.log("Hiding...");
  collapsible.on_hidden = (data) => console.log("Hidden!");

  Menu(
    {
      parent: root,
      css: {
        //"column-gap-3.ps-0": true,
        "column-gap-3": true,
        "ps-0": true,
      },
    },
    create(
      "button.btn",
      {
        css: { btnPrimary: true },
        on_click: (event) => {
          collapsible.open = true;
        },
      },
      "Show"
    ),
    create(
      "button.btn",
      {
        css: { btnPrimary: true },
        on_click: (event) => {
          collapsible.open = false;
        },
      },
      "Hide"
    )
  );
})();
