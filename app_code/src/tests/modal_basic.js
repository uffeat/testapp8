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
    {text: "OK", value: true, css: "btn-success"},
    {text: "Cancel", value: false, css: "btn-danger"}
  );
  console.log("Result:", result);
})();