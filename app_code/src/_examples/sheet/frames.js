
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
      animationDuration: "3s",
      animationName: "slide_in",
    },
  });

  document.adoptedStyleSheets.push(sheet.sheet);

  sheet.frames.add("slide_in", {
    0: { translate: "150vw 0", scale: "200% 4" },
    "100%": { translate: "0 0", scale: "100% 1" },
  });

  sheet.frames
    .get("slide_in")
    .get(0)
    .update({ scale: "400% 1", color: "green" });
})();