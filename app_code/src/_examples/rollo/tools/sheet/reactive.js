/* Purpose: Demonstrate and test Sheet and related. */
await (async () => {
  const { Data } = await import("@/rollo/type/types/reactive/data/data");
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
  

  /* Create sheet from text and adopt to document
  (text should be imported for non-demo cases). */
  const text = `
  h1 {
    color: pink;
  }

  h3 {
    color: pink;
  }

  h3 {
    /* My comment */
    --name: hot;
    padding: 16px;
  }

  @media (400px <= width) {
    h1 {
      color: green;
    }
  }
  `;
  const my_sheet = Sheet(text, document);

  /* Retrieve and change unique-selector rule implemented via text */
  (() => {
    const rule = my_sheet.find("h1");
    rule.item.color = "red";
  })();

  /* Retrieve and change unique-condition media rule implemented via text */
  (() => {
    const media_rule = my_sheet.find("@media (400px <= width)");
    ////console.log("media_rule:", media_rule);////
    const rule = media_rule.find("h1");
    ////console.log("rule:", rule);////
    rule.item.color = "lime";
  })();

  /* Retrieve and change non-unique-selector rule implemented via text */
  (() => {
    const rule = my_sheet.search(
      "h3",
      (rule) => rule.items["--name"] === "hot"
    )[0];
    ////console.log("rule:", rule);////
    rule.item.backgroundColor = "linen";
    ////my_sheet.remove(rule);
  })();

  /* Remove first occurance of non-unique-selector rule implemented via text */
  (() => {
    my_sheet.remove("h3");
  })();

  /* Add and change standard rule */
  (() => {
    const rule = my_sheet.add("h2", { color: "blue" });
    rule.item.color = "dodgerblue";
    rule.selector = "h2:hover";
  })();

  /* Add media rule */
  (() => {
    const media_rule = my_sheet.add("@media (400px <= width)", {
      h2: { color: "blue" },
    });
  })();

  /* Retrieve and change non-unique-condition media rule */
  (() => {
    const media_rule = my_sheet.search("@media (400px <= width)", (rule) =>
      rule.find("h2")
    )[0];
    ////console.log("media_rule:", media_rule);////
    const rule = media_rule.find("h2");
    console.log("rule:", rule); ////
    rule.item.backgroundColor = "cornsilk";
    //my_sheet.remove(media_rule)
    //my_sheet.remove("@media (400px <= width)")
  })();

  console.log("text:", my_sheet.text); ////


  code.text = my_sheet.to_text()

  /* Clean up */
  const cleanup = () => {
    my_sheet.unbind();
    root.remove();
  };
  //cleanup(); ////
})();