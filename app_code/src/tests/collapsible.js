// collapsible

await (async () => {
  const { create } = await import("rollo/component");
  const { Collapsible } = await import("rolloui/Collapsible");
  const { Menu } = await import("rolloui/Menu");

  create("div", {
    id: "root",
    parent: document.body,
  });

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
      '.column-gap-3.ps-0': true,
    },
    create(
      "button.btn.btn-primary",
      {
        on_click: (event) => {
          collapsible.open = true;
        },
      },
      "Show"
    ),
    create(
      "button.btn.btn-primary",
      {
        on_click: (event) => {
          collapsible.open = false;
        },
      },
     
      "Hide"
    )
  );
})();
