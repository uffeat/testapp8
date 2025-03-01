/* Purpose: Demonstrate and test server calls */
await (async () => {
  const { server } = await import("@/tools/server");

  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };

  const result = await server.foo(data);
  console.log("result:", result); ////
})();
