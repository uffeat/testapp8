/* Purpose: Demonstrate and test Sheet.media. */
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
    },
    "@media (200px <= width)": {
      h3: {
        color: "orange",
      },
    },
    "@media (400px <= width)": {
      h1: {
        color: "blue",
      },
    },
  });

  /* Add and change media */
  (() => {
    const media_rule = sheet.media.add({
      "@media (600px <= width)": { h2: { color: "red" } },
    });
    media_rule.get("h2").update({ backgroundColor: "linen" });

    test(`@media (200px <= width) { h3 { color: orange; }} @media (400px <= width) { h1 { color: blue; }} @media (600px <= width) { h2 { color: red; background-color: linen; }}`, sheet.media.text(false));
    test(`{"@media (200px <= width)":{"h3":{"color":"orange"}},"@media (400px <= width)":{"h1":{"color":"blue"}},"@media (600px <= width)":{"h2":{"color":"red","background-color":"linen"}}}`, sheet.media.json());
    test(3, sheet.media.size());
  })();

  /* Change media */
  (() => {
    sheet.media.get("400px <= width").get("h1").item.color = "green";
  })();

  /* Remove media */
  (() => {
    sheet.media.remove("200px <= width");
    test(`h1 { background-color: linen; } @media (400px <= width) { h1 { color: green; }} @media (600px <= width) { h2 { color: red; background-color: linen; }}`, sheet.text(false)
  );
  test(`{"h1":{"background-color":"linen"},"@media (400px <= width)":{"h1":{"color":"green"}},"@media (600px <= width)":{"h2":{"color":"red","background-color":"linen"}}}`, sheet.json()
  );
  })();

  /* Clear media */
  (() => {
    sheet.media.clear();
    test(0, sheet.media.size());
  })();

  

  code.text = sheet.text();

  /* Clean up */
  const cleanup = () => {
    sheet.unbind();
    root.remove();
  };
  cleanup(); ////
})();