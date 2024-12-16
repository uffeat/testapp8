// css_media

await (async () => {
  const { create } = await import("rollo/component");
  await import("rollo/components/css/css_frames");
  await import("rollo/components/css/css_frame");
  await import("rollo/components/css/css_match");
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
      create(
        "css-media",
        { name: "my_media", media: "600px <= width <= 800px" },
        create(
          "css-rule",
          {
            name: "my_media_rule",
            h1: {
              color: "pink",
              backgroundColor: "linen",
              padding: "8px",
            },
          },
          function () {
            this.effects.add((current, previous) => {
              if (previous.color) {
                console.log("Color was:", previous.color);
              }
              if (current.color) {
                console.log("Color is:", current.color);
              }
            }, "color");
          }
        ),
        function () {
          this.effects.add((current, previous) => {
            if (previous.media) {
              console.log("Media was:", previous.media);
            }
            if (current.media) {
              console.log("Media is:", current.media);
            }
          }, "media");
        },
        create("css-match", { name: "my_match" }, function () {
          this.effects.add((current, previous) => {
            console.log("Previous match was:", previous.match);
            console.log("Current match is:", current.match);
          }, "match");
        })
      )
    )
  );
  const my_media = document.querySelector(`css-media[name="my_media"]`);

  my_media.media = "width <= 800px";
  /* NOTE This not only changes the media rule, but also affects any 
  "css-media"-components' "match"-effects! */
})();
