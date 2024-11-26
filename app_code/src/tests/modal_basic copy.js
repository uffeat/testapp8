// modal_basic

await (async () => {
  const { close, modal } = await import("rolloui/modal");
  const result = await modal(
    {
      title: "Hello world!",
      content: "The modal function is awesome.",
      size: "lg",
      style: "primary",
    },
    ["OK", true, "success"],
    ["Cancel", false, "danger"]
  );
  console.log("Modal result:", result);
})();