/* Define test loaders */
modules.src
  /* Vite-native import of css, incl. css as text */
  .add(
    import.meta.glob([
      "/src/**/*.css",
      "!/src/rollotest/**/*.*",
      "!/src/main/**/*.*",
    ])
  )
  .add(
    import.meta.glob(["/src/test/**/*.css"], {
      import: "default",
      query: "?raw",
    }),
    { raw: true }
  )
  /* Import of html as text */
  .add(
    import.meta.glob(["/src/test/**/*.html"], {
      import: "default",
      query: "?raw",
    }),
    { raw: true }
  )
  /* Vite-native import of js as module and text */
  .add(import.meta.glob(["/src/test/**/*.js"]))
  .add(
    import.meta.glob(["/src/test/**/*.js"], {
      import: "default",
      query: "?raw",
    }),
    { raw: true }
  )
  /* Vite-native json import */
  .add(import.meta.glob(["/src/test/**/*.json"]))
  /* Import of template as text */
  .add(
    import.meta.glob(["/src/test/**/*.template"], {
      import: "default",
      query: "?raw",
    }),
    { raw: true }
  );
