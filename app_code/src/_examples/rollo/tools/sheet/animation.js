/* Purpose: Demonstrate and test Sheet.animation. */
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
    { id: "root", parent: document.body },
    element.h1({}, "Headline"),
    element.h2({}, "Headline"),
    element.h3({}, "Headline")
  );

  const code = component.pre({ padding: "16px", parent: root });

  const sheet = Sheet(document, {
    h1: {
      backgroundColor: "linen",
      animationDuration: "3000ms",
      animationName: "slide_in",
      color: "pink",
    },
    h2: {
      animationDuration: "3s",
      animationName: "move",
    },
    h3: {
      animationDuration: "3s",
      animationName: "color",
    },
    "@keyframes color": {
      0: { color: "red" },
      100: { color: "pink" },
    },
    "@keyframes slide_in": {
      0: {
        translate: "150vw",
        scale: "2 4",
      },
      100: {
        translate: 0,
        scale: 1,
      },
    },
  });

  /* Change animation in different ways */
  (() => {
    const animation_rule = sheet.animation.get("slide_in");

    // Alternatively:
    //const animation_rule = sheet.animation.add({"slide_in": {}})

    animation_rule.add({ 50: { scale: 3 } });
    animation_rule.get(100).update({ scale: 0 });
  })();

  /* Add and change animation in different ways */
  (() => {
    const animation_rule = sheet.animation.add({
      move: {
        0: { color: "red", paddingLeft: "8px" },
        100: { color: "green", paddingLeft: "0" },
      },
    });
    animation_rule.update({ 0: { paddingTop: "48px" } });
    animation_rule.get(0).item.scale = "0";
    animation_rule.add({ 0: { backgroundColor: "pink" } });
  })();

  /* Remove animation */
  (() => {
    sheet.animation.remove("color");
    sheet.animation.remove("color");
  })();

  /* Check representations */
  (() => {
    test(2, sheet.animation.size());
    test(
      `@keyframes slide_in { 0% { translate: 150vw; scale: 2 4; } 100% { translate: 0px; scale: 0; } 50% { scale: 3; }} @keyframes move { 0% { color: red; padding-left: 8px; padding-top: 48px; scale: 0; background-color: pink; } 100% { color: green; padding-left: 0px; }}`,
      sheet.animation.text(false)
    );
    test(
      `{"@keyframes slide_in":{"0%":{"translate":"150vw","scale":"2 4"},"100%":{"translate":"0px","scale":"0"},"50%":{"scale":"3"}},"@keyframes move":{"0%":{"color":"red","padding-left":"8px","padding-top":"48px","scale":"0","background-color":"pink"},"100%":{"color":"green","padding-left":"0px"}}}`,
      sheet.animation.json()
    );

    const slide_in = sheet.animation.get("slide_in");
    test(3, slide_in.size());
    test(
      `@keyframes slide_in { 0% { translate: 150vw; scale: 2 4; } 100% { translate: 0px; scale: 0; } 50% { scale: 3; }}`,
      slide_in.text(false)
    );
    test(
      `{"@keyframes slide_in":{"0%":{"translate":"150vw","scale":"2 4"},"100%":{"translate":"0px","scale":"0"},"50%":{"scale":"3"}}}`,
      slide_in.json()
    );
  })();

  code.text = sheet.text();

  /* Clear animation */
  (() => {
    const move = sheet.animation.get("move");
    move.clear();
    test(0, move.size());
    test(`@keyframes move { }`, move.text(false));
    test(`{"@keyframes move":{}}`, move.json());
  })();

  /* Clean up */
  const cleanup = () => {
    sheet.unbind();
    root.remove();
  };
  cleanup(); ////
})();
