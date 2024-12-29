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
    {text: "OK", value: true, ".btn-success": true},
    {text: "Cancel", value: false, ".btn-danger": true}
  );
  console.log("Result:", result);
})();