import "./bootstrap.scss";
import "./main.css";

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
      
      create(
        "css-media",
        { name: "my_media", media: "600px <= width <= 800px" },
        create("css-rule", {
          name: "my_media_rule",
          h1: {
            color: "pink",
            backgroundColor: "linen",
            padding: "8px",
            
          },
        }),
      ),
      
    )
  );
  const my_sheet = document.querySelector(`css-sheet[name="my_sheet"]`);
  const my_media = document.querySelector(`css-media[name="my_media"]`);
  const my_media_rule = document.querySelector(
    `css-rule[name="my_media_rule"]`
  );

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
