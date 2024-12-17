// toast

await (async () => {
  const { create } = await import("rollo/component");
  const { toast } = await import("rolloui/toast");

  create("div", {
    id: "root",
    parent: document.body,
  });

  toast("Awesome", "Content");
  toast("Staying long", "Content", { delay: 20000, style: "success" });
})();
