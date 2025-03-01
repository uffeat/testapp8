
await (async () => {
  const { Data } = await import("rollo/type/types/data/data");
  const { Sheet } = await import("@/rollo/type/types/sheet/sheet");
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );
  const { default: test } = await import("@/sheets/test.json");

  const root = component.div({ id: "root", parent: document.body });
  component.h1(
    {
      parent: root,
    },
    "Hello"
  );
  component.h2(
    {
      parent: root,
    },
    "Hello"
  );

  const sheet = Sheet(test);

  ////console.log("test:", test); ////
  ////const object = sheet.to_object()
  ////console.log("object:", object); ////

  if (Data(test.h1).match(sheet.to_object().h1)) {
    console.log("Success!");
  } else {
    console.error("Something went wrong...");
  }

  document.adoptedStyleSheets.push(sheet.sheet);

  sheet.rules.get("my_rule").update({ selector: "h1, h2", color: "red" });

  sheet.media
    .get("my_media")
    // NOTE rules.get() does not work for media rules, when sheet created from built json
    .rules.find("h1")
    .update({ backgroundColor: "green" });

  sheet.frames
    .get("slide_in")
    .get(0)
    .update({ scale: "400% 1", color: "green" });

  ////console.log("text:", sheet.text); ////
})();