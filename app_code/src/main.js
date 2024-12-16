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
  const DELAY = 3000;
  const action_display = create("p", { parent: root, padding: "8px", text: 'Original CSS.' });
  const css_display = create("code", { parent: root, padding: "8px" });

  new (class {
    constructor(...owners) {
      owners.forEach((owner) =>
        owner.effects.add((current, previous, component) => {
          if (current.target) {
            component.effects.add(this.effect);
          } else {
            component.effects.remove(this.effect);
          }
        }, "target")
      );
    }
    effect = () => (css_display.text = my_sheet.text);
  })(my_rule, my_rule_clone);

  pipe(
    null,
    /* Update color and selector; backgroundColor and padding remain the same */
    async () => {
      await delay(DELAY);
      my_rule.update({ color: "green", selector: "h2" });
      action_display.text = 'Updated color and selector; backgroundColor and padding remain the same.'
    },
    /* Update color; selector and all other items remain the same */
    async () => {
      await delay(DELAY);
      my_rule.$.color = "blue";
      action_display.text = 'Updated color; selector and all other items remain the same.'
    },
    /* Reset rule completely */
    async () => {
      await delay(DELAY);
      my_rule.rule = { h1: { backgroundColor: "beige" } };
      action_display.text = 'Reset rule completely.'
    },
    /* Reset rule, but selector */
    async () => {
      await delay(DELAY);
      my_rule.rule = { color: "red" };
      action_display.text = 'Reset rule, but selector.'
    },
    /* Remove rule */
    async () => {
      await delay(DELAY);
      my_rule.remove();
      action_display.text = 'Removed rule (no CSS).'
    },
    /* Apply clone (restores original) */
    async () => {
      await delay(DELAY);
      my_sheet.append(my_rule_clone);
      action_display.text = 'Applied clone (restored original CSS).'
    },
    /* Remove clone */
    async () => {
      await delay(DELAY);
      my_rule_clone.remove();
      action_display.text = 'Removed clone (no CSS).'
    },
    /* Restore without adding to the DOM */
    async () => {
      await delay(DELAY);
      my_rule_clone.target = my_sheet;
      action_display.text = 'Assigned target to clone without adding clone to the DOM (restored original CSS).'
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
