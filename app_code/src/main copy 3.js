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
  const { delay } = await import("rollo/utils/delay");

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
        "css-rule",
        {
          name: "my_rule",
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
        },
        function () {
          this.effects.add((current, previous) => {
            /* BUG Initial effect run does not correctly identify previous.selector (NOT critical!) */
            if (previous.selector) {
              console.log("Selector was:", previous.selector);
            }
            if (current.selector) {
              console.log("Selector is:", current.selector);
            }
          }, "selector");
        }
      )
    )
  );

  const my_sheet = document.querySelector(`css-sheet[name="my_sheet"]`);
  const my_rule = document.querySelector(`css-rule[name="my_rule"]`);
  const my_rule_clone = my_rule.clone();




// Async function to perform the series of operations
async function test() {
  // Update color and selector; backgroundColor and padding remain the same
  await delay(1000);
  my_rule.update({ color: "green", selector: "h2" });

  // Update color; selector and all other items remain the same
  await delay(1000);
  my_rule.$.color = "blue";

  // Reset rule completely
  await delay(1000);
  my_rule.rule = { h1: { backgroundColor: "beige" } };

  // Reset rule but keep selector
  await delay(1000);
  my_rule.rule = { color: "red" };

  // Remove rule
  await delay(1000);
  my_rule.remove();

  // Apply clone (restores original)
  await delay(1000);
  my_sheet.append(my_rule_clone);

  // Remove rule
  await delay(1000);
  my_rule_clone.remove();

  // Restore without adding to the DOM
  await delay(1000);
  my_rule_clone.target = my_sheet;
}


test();
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
