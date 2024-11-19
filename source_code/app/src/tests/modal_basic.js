// modal_basic

await (async () => {
  const { modal } = await import("utils/modal");
  const result = await modal(
    { title: "Hello world!", content: "The modal function is awesome.", size: 'lg', style: 'primary' },
    ["OK", true, 'success'], ["Cancel", false, 'danger']
  );
  console.log("Modal result:", result);
})();