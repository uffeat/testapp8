import { server } from "@/rolloanvil/server.js";


server
  .echo([1,2,3])
  .then((response) => console.log("server response:", response));

server
  .echo([1,2,3])
  .then((response) => console.log("server response:", response));


server
  .foo()
  .then((response) => console.log("server response:", response));