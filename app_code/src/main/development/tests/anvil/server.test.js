/*
anvil/server
*/

import { server } from "@/rolloanvil/server.js";

export const test = async () => {
  const data = {
    email: "name@company.com",
    score: 8,
    accept: true,
    bar: null,
    stuff: false,
  };
  
  const result = await server.foo(data);
  console.log("result:", result);
  
  const raw = await server.foo(data, { raw: true });
  console.log("raw:", raw);
  
}

