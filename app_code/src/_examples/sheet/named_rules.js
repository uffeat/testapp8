
await (async () => {
  const { Sheet } = await import("@/rollo/type/types/sheet/sheet");
  const { Component, component } = await import(
    "@/rollo/type/types/component/component"
  );

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

  const sheet = Sheet({
    h1: {
      name: "my_rule",
      color: "pink",
      backgroundColor: "linen",
      padding: "8px",
      animationDuration: "3s",
      animationName: "slide_in",
    },
    "@keyframes slide_in": {
      0: {
        translate: "150vw 0",
        scale: "200% 4",
      },
      "100%": {
        translate: "0 0",
        scale: "100% 1",
      },
    },
    "@media (width <= 400px)": {
      name: "my_media",
      h1: {
        name: "my_media_rule",
        backgroundColor: "blue",
      },
    },
  });

  document.adoptedStyleSheets.push(sheet.sheet);

  sheet.rules.get("my_rule").update({ selector: "h1, h2", color: "red" });
  ////sheet.rules.get("my_rule").clear()

  sheet.media
    .get("my_media")
    //.rules.get("my_media_rule")
    .rules.find("h1")
    .update({ backgroundColor: "green" });

  sheet.frames
    .get("slide_in")
    .get(0)
    .update({ scale: "400% 1", color: "green" });

  console.log("object:", sheet.to_object()); ////
  console.log("text:", sheet.text); ////
})();