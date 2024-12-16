// css_frames

await (async () => {
  const { create } = await import("rollo/component");
  await import("rollo/components/css/css_frames");
  await import("rollo/components/css/css_frame");
  await import("rollo/components/css/css_media");
  await import("rollo/components/css/css_rule");
  await import("rollo/components/css/css_sheet");
  await import("rollo/components/css/css_sheets");

  create("div", {
    id: "root",
    parent: document.body,
  });

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
        "css-frames",
        {
          name: "slide_in",
        },
        create(
          "css-frame",
          {
            name: "my_frame_0",
            0: { translate: "150vw 0", scale: "200% 1" },
          },
          function () {
            this.effects.add((current, previous) => {
              console.log("Frame was:", previous.frame);
              console.log("Frame is:", current.frame);
            }, "frame");
          },
          function () {
            this.effects.add((current, previous) => {
              console.log("scale was:", previous.scale);
              console.log("scale is:", current.scale);
            }, "scale");
          }
        ),
        /* NOTE Alternative (less compact) way of specifying frame */
        create("css-frame", {
          name: "my_frame_1",
          frame: 100,
          translate: "0 0",
          scale: "100% 1",
        })
      )
    )
  );
  const my_rule = document.querySelector(`css-rule[name="my_rule"]`);
  //my_rule.$.animationDuration = '1s'
  const slide_in = document.querySelector(`css-frames[name="slide_in"]`);
  const my_frame_0 = document.querySelector(`css-frame[name="my_frame_0"]`);
  const my_frame_0_clone = my_frame_0.clone();
  //my_frame_0.update({scale: "400% 1"})
  //my_frame_0.remove()
  //slide_in.append(my_frame_0_clone)
  my_frame_0.rule = { 50: { translate: "150vw 0", scale: "400% 1" } };
})();