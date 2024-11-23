// foo_endpoint

await (async () => {
  const { server } = await import('utils/server')
  
  const data = { email: "name@company.com", number: 42, accept: true };
  const result = await server.foo(data);
  console.log("Result:", result);
  alert(JSON.stringify(result))

})();