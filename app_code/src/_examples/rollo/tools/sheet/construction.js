/* Purpose: Demonstrate and test sheet construction. */
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

  const sheet = Sheet(
    { name: "my_sheet" },
    document,
    `h1 {
      background-color: linen;
      animation-duration: 3000ms;
      animation-name: slide_in;
    }`,
    {
      h1: {
        color: "pink",
      },
      h2: {
        animationDuration: "3s",
        animationName: "move",
      },
    },
    `@keyframes slide_in {
      0% {
        translate: 150vw;
        scale: 2 4;
      }
      100% {
        translate: 0;
        scale: 1;
      }
    }`,
    {
      h3: {
        animationDuration: "3s",
        animationName: "color",
      },
      "@keyframes color": {
        0: { color: "red" },
        100: { color: "pink" },
      },
    }
  );

  code.text = sheet.text();

  test("my_sheet", sheet.name);
  test(
    `h1 { background-color: linen; animation-duration: 3000ms; animation-name: slide_in; color: pink; } @keyframes slide_in { 0% { translate: 150vw; scale: 2 4; } 100% { translate: 0px; scale: 1; }} h2 { animation-duration: 3s; animation-name: move; } h3 { animation-duration: 3s; animation-name: color; } @keyframes color { 0% { color: red; } 100% { color: pink; }}`,
    sheet.text(false)
  );
  test(
    `{"h1":{"background-color":"linen","animation-duration":"3000ms","animation-name":"slide_in","color":"pink"},"h2":{"animation-duration":"3s","animation-name":"move"},"h3":{"animation-duration":"3s","animation-name":"color"},"@keyframes slide_in":{"0%":{"translate":"150vw","scale":"2 4"},"100%":{"translate":"0px","scale":"1"}},"@keyframes color":{"0%":{"color":"red"},"100%":{"color":"pink"}}}`,
    sheet.json()
  );

  /* Clean up */
  const cleanup = () => {
    sheet.unbind();
    root.remove();
  };
  //cleanup(); ////
})();