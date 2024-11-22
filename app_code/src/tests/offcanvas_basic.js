// offcanvas_basic

import { close, offcanvas } from "rolloui/offcanvas";

const result = await offcanvas(
  {
    title: "Hello world!",
    content: "The offcanvas function is awesome.",
    placement: 'top'
  },
  ["OK", true, "success"],
  ["Cancel", false, "danger"]
);
console.log("Modal result:", result);
