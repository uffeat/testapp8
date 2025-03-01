/* Purpose: Demonstrate and test of sheet tools. 
NOTE
- Although a bit more verbose, sheet tools make it possible to control a native sheet. */
await (async () => {
  const { component } = await import("@/rollo/type/types/component/component");
  const { element } = await import("@/rollo/tools/element");
  const { update } = await import("@/rollo/sheet/tools/update");
  const { add } = await import("@/rollo/sheet/tools/add");
  const { find } = await import("@/rollo/sheet/tools/find");
  const { index } = await import("@/rollo/sheet/tools/index");
  const { object } = await import("@/rollo/sheet/tools/object");
  const { remove } = await import("@/rollo/sheet/tools/remove");
  const { text } = await import("@/rollo/sheet/tools/text");
  const { adopt, unadopt } = await import("@/rollo/sheet/tools/target");
  const { Rule } = await import("@/rollo/sheet/types/rule/rule");

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

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    h1 {
      color: pink;
      background-color: linen;
      animation-duration: 3000ms;
      animation-name: slide_in;
    }

    h3 {
      color: green;
    }
  
    @keyframes slide_in {
      0% {
        translate: 150vw;
        scale: 2 4;
      }
      100% {
        translate: 0;
        scale: 1;
      }
    }
  
    @media (width >= 400px) {
      h1 {
        background-color: blue;
        padding: 16px !important;
      }
    }`);

  adopt(document, sheet);

  /* Add and change style rule */
  (() => {
    const native = add(sheet, { h2: { color: "pink" } });
    update(native, { backgroundColor: "linen" });

    // Alternatively:
    //const rule = Rule(native)
    //rule.update({ backgroundColor: "linen" })
  })();

  /* Find and change style rule */
  (() => {
    const native = find(sheet, (r) => r.selectorText === "h1");
    update(native, { color: "red" });
  })();

  /* Remove style rule */
  (() => {
    remove(sheet, (r) => r.selectorText === "h3");

    // Alternatively:
    //const i = index(sheet, (r) => r.selectorText === "h3")
    //sheet.deleteRule(i)
  })();

  /* Add and change media rule */
  (() => {
    const native_media = add(sheet, {
      "@media (width >= 300px)": { h3: { color: "pink" } },
    });
    const native = find(native_media, (r) => r.selectorText === "h3");
    update(native, { color: "green" });
  })();

  /* Find and change media rule */
  (() => {
    const native_media = find(
      sheet,
      (r) => r.conditionText === "(width >= 400px)"
    );
    add(native_media, { h2: { color: "green !important" } });
    const native = find(native_media, (r) => r.selectorText === "h1");
    update(native, { color: "green" });
  })();

  /* Remove media rule */
  (() => {
    remove(sheet, (r) => r.conditionText === "(width >= 300px)");
  })();

  /* Add and change frames rule */
  (() => {
    add(sheet, { h2: { animationDuration: "3000ms", animationName: "move" } });
    const native_frames = add(sheet, {
      "@keyframes move": {
        "0%": { scale: 0 },
        "50%": { scale: 3 },
        "100%": { scale: 2 },
      },
    });
    const native = find(native_frames, (r) => r.keyText === "100%");
    update(native, { scale: 1 });
  })();

  /* Find and change frames rule */
  (() => {
    const native_frames = find(sheet, (r) => r.name === "slide_in");
    const native = find(native_frames, (r) => r.keyText === "100%");
    update(native, { scale: 0 });
  })();

  /* Remove frame rule */
  (() => {
    const native_frames = find(sheet, (r) => r.name === "move");
    remove(native_frames, "50%");
  })();

  /* Check final sheet  */
  (() => {
    test(
      `{"h1":{"color":"red","background-color":"linen","animation-duration":"3000ms","animation-name":"slide_in"},"@keyframes slide_in":{"0%":{"translate":"150vw","scale":"2 4"},"100%":{"translate":"0px","scale":"0"}},"@media (width >= 400px)":{"h1":{"background-color":"blue","padding-top":"16px !important","padding-right":"16px !important","padding-bottom":"16px !important","padding-left":"16px !important","color":"green"},"h2":{"color":"green !important"}},"h2":{"color":"pink","background-color":"linen","animation-duration":"3000ms","animation-name":"move"},"@keyframes move":{"0%":{"scale":"0"},"100%":{"scale":"1"}}}`,
      JSON.stringify(object(sheet))
    );
    test(
      `h1 { color: red; background-color: linen; animation-duration: 3000ms; animation-name: slide_in; } @keyframes slide_in { 0% { translate: 150vw; scale: 2 4; } 100% { translate: 0px; scale: 0; }} @media (width >= 400px) { h1 { background-color: blue; padding: 16px !important; color: green; } h2 { color: green !important; }} h2 { color: pink; background-color: linen; } h2 { animation-duration: 3000ms; animation-name: move; } @keyframes move { 0% { scale: 0; } 100% { scale: 1; }}`,
      text(sheet, false)
    );
  })();

  code.text = text(sheet);

  /* Clean up */
  const cleanup = () => {
    unadopt(document, sheet);
    root.remove();
  };
  cleanup(); ////
})();