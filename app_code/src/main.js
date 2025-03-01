import { server } from "@/tools/server";

const data = {
  email: "name@company.com",
  score: 8,
  accept: true,
  bar: null,
  stuff: false,
};

const result = await server.foo(data);
console.log("result:", result); ////