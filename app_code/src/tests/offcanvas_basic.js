// offcanvas_basic

await (async () => {
  const { close, offcanvas } = await import("rolloui/offcanvas");
  const result = await offcanvas(
    {
      title: "Hello world!",
      content: "The offcanvas function is awesome.",
      placement: "start",
      style: "primary",
    },
    ["OK", true, "success"],
    ["Cancel", false, "danger"]
  );
  console.log("Modal result:", result);
})();