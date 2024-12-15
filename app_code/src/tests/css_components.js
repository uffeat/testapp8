// css_components

await (async () => {
  const { create } = await import("rollo/component");
  await import("rollo/components/css/css_frames");
  await import("rollo/components/css/css_frame");
  await import("rollo/components/css/css_media");
  await import("rollo/components/css/css_rule");
  await import("rollo/components/css/css_sheet");
  await import("rollo/components/css/css_sheets");

  if (!root) {
    create("div", {
      id: "root",
      parent: document.body,
    });
  }

  /* Create elements to test css on */
  create("h1", { parent: root }, "Hello World");
  create("h2", { parent: root }, "Also hello from here");

  /* Build sheet */
create(
  "css-sheets",
  { name: "my_sheets", parent: root },
  create(
    "css-sheet",
    { name: "my_sheet" },
    create("css-rule", {
      name: "my_rule",
      h1: {
        color: "pink",
        backgroundColor: "linen",
        padding: "8px",
        animationDuration: "3s",
        animationName: "slide_in",
      },
    }),
    create(
      "css-media",
      { name: "my_media", media: "600px <= width <= 800px" },
      create("css-rule", {
        name: "my_media_rule",
        h1: {
          border: "4px solid red",
        },
      })
    ),
    create(
      "css-frames",
      {
        name: "slide_in",
      },
      create("css-frame", {
        name: "my_frame_0",
        0: { translate: "150vw 0", scale: "200% 1" },
      }),
      create("css-frame", {
        name: "my_frame_1",
        frame: 100,
        translate: "0 0",
        scale: "100% 1",
      })
    )
  )
);
const my_sheet = document.querySelector(`css-sheet[name="my_sheet"]`);
const my_rule = document.querySelector(`css-rule[name="my_rule"]`);
const my_media = document.querySelector(`css-media[name="my_media"]`);
const my_media_rule = document.querySelector(`css-rule[name="my_media_rule"]`);
const my_frame_0 = document.querySelector(`css-frame[name="my_frame_0"]`);
})();
