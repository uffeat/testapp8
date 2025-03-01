
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

  const sheet = Sheet({
    h1: {
      color: "pink",
      backgroundColor: "linen",
      padding: "8px",
    },
  });

  document.adoptedStyleSheets.push(sheet.sheet);

  const my_media = sheet.media.add("width <= 400px", {
    h1: {
      name: "my_media_rule",
      backgroundColor: "blue",
    },
  });
  my_media.rules.get("my_media_rule").update({ backgroundColor: "green" });
  /* Alternatively 
  my_media.rules.find("h1").update({ backgroundColor: "green" });
  */

  ////console.log("sheet:", sheet);////
})();