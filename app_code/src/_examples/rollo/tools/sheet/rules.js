/* Purpose: Demonstrate and test Sheet.rules. */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { element } = await import("@/rollo/tools/element");
  const { Sheet } = await import("@/rollo/sheet/sheet");

  /* Test utils */
  const error = (expected, actual) =>
    console.error(`Expected:`, expected, `Actual:`, actual);
  const success = () => console.log("Success!");
  const test = (expected, actual) => {
    if (expected === actual) {
      success();
    } else {
      error(expected, actual);
    }
  };

  const root = component.div(
    { parent: document.body },
    element.h1({}, "Headline"),
    element.h2({}, "Headline"),
    element.h3({}, "Headline")
  );

  const code = component.pre({ padding: "16px", parent: root });

  const sheet = Sheet(document, {
    h1: {
      backgroundColor: "linen",
      color: "pink",
    },

    h3: {
      backgroundColor: "oldlace",
      color: "green",
    },
  });

  /* Add and change rule */
  (() => {
    const rule = sheet.rules
      .add({ h2: { backgroundColor: "dodgerblue" } })
      .update({ color: "pink" });
  })();

  /* Change rule */
  (() => {
    const rule = sheet.rules.get("h1").update({ color: "orange" });
    rule.item.padding = "24px";
  })();

  /* Remove rule */
  (() => {
    sheet.rules.remove("h3");

    test(
      `h1 { background-color: linen; color: orange; padding: 24px; } h2 { background-color: dodgerblue; color: pink; }`,
      sheet.rules.text(false)
    );
    test(
      `{"h1":{"background-color":"linen","color":"orange","padding-top":"24px","padding-right":"24px","padding-bottom":"24px","padding-left":"24px"},"h2":{"background-color":"dodgerblue","color":"pink"}}`,
      sheet.rules.json()
    );
    test(2, sheet.rules.size());
  })();

  /* Clear rules */
  (() => {
    sheet.rules.clear();
    test(``, sheet.rules.text());
    test(`{}`, sheet.rules.json());
    test(0, sheet.rules.size());
  })();

  code.text = sheet.text();

  /* Clean up */
  const cleanup = () => {
    sheet.unbind();
    root.remove();
  };
  cleanup(); ////
})();
