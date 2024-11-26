// offcanvas_basic

await (async () => {
  const { close, offcanvas } = await import("rolloui/offcanvas");
  const result = await offcanvas(
    {
      title: "Hello world!",
      content: "The offcanvas function is awesome.",
      placement: "start",
      style: "primary",
      hooks: [function() {
        console.log('Hello from hook')
        console.log(this)

      }]
    },
    {text: "OK", value: true, css: "btn-success"},
    {text: "Cancel", value: false, css: "btn-danger"}
  );
  console.log("Result:", result);
})();