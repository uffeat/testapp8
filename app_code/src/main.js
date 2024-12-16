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
  const { pipe } = await import("rollo/utils/pipe/async");

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
  const DELAY = 1000;
  const css_display = create("code", { parent: root, padding: "8px" });

  const css_effect = () => {
    console.log("css:", my_sheet.text);
    css_display.text = my_sheet.text;
  };

  const target_effect = (current, previous, owner) => {
    if (current.target) {
      owner.effects.add(css_effect);
    } else {
      owner.effects.remove(css_effect);
    }
  }

  my_rule.effects.add(target_effect, "target");
  my_rule_clone.effects.add(target_effect, "target");

  pipe(
    null,
    /* Update color and selector; backgroundColor and padding remain the same */
    async () => {
      await delay(DELAY);
      my_rule.update({ color: "green", selector: "h2" });
    },
    /* Update color; selector and all other items remain the same */
    async () => {
      await delay(DELAY);
      my_rule.$.color = "blue";
    },
    /* Reset rule completely */
    async () => {
      await delay(DELAY);
      my_rule.rule = { h1: { backgroundColor: "beige" } };
    },
    /* Reset rule, but selector */
    async () => {
      await delay(DELAY);
      my_rule.rule = { color: "red" };
    },
    /* Remove rule */
    async () => {
      await delay(DELAY);
      my_rule.remove();
    },
    /* Apply clone (restores original) */
    async () => {
      await delay(DELAY);
      my_sheet.append(my_rule_clone);
    },
    /* Remove clone */
    async () => {
      await delay(DELAY);
      my_rule_clone.remove();
    },
    /* Restore without adding to the DOM */
    async () => {
      await delay(DELAY);
      my_rule_clone.target = my_sheet;
    }
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
