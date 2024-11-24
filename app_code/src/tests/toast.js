// toast

await (async () => {
  const { toast } = await import("rolloui/toast");
  toast("Awesome", "Content");
  toast("Staying long", "Content", { delay: 20000, style: "success" });
})();