// css_static

await (async () => {
  const { create } = await import("rollo/component");
  await import("rollo/components/css/css_sheet");
  await import("rollo/components/css/css_sheets");
  await import("rollo/components/css/css_static");

  create("div", {
    id: "root",
    parent: document.body,
  });

  /* Create elements to test css on */
  create("h1", { parent: root }, "Hello World");
  create("h2", { parent: root }, "Also hello from here");

  create(
    "css-sheets",
    { name: "my_sheets", parent: root },
    create(
      "css-sheet",
      { name: "my_sheet" },
      function() {
        this.effects.add(() => {
          if (this.disabled) {
            console.log('Sheet is disabled.')
          } else {
            console.log('Sheet is enabled.')
          }

        }, 'disabled')
      },
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
  const my_static_clone = my_static.clone();

  create(
    "menu",
    {
      parent: root,
      display: "flex",
      padding: "4px",
      columnGap: "8px",
      on_click: (event) => {
        if (event.target._re_disable) {
          my_sheet.disabled = event.target._value;
        } else if (event.target._re_static) {
          if (event.target._value) {
            my_static.remove();
            root.append(my_static_clone);
          } else {
            my_static_clone.remove();
            my_sheet.append(my_static);
          }
        }
      },
    },
    create("button", {
      text: "Disable sheet",
      _re_disable: true,
      _value: true,
    }),
    create("button", {
      text: "Enable sheet",
      _re_disable: true,
      _value: false,
    }),
    create("button", {
      text: "Replace with clone",
      _re_static: true,
      _value: true,
    }),
    create("button", {
      text: "Restore static",
      _re_static: true,
      _value: false,
    })
  );
})();
