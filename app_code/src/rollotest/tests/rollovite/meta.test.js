/*
rollovite/meta
*/

import { modules } from "@/rollovite/modules.js";

const success = () => console.info("Success!");

export const test_public = (unit_test) => {
  if (unit_test) {
    console.log("Number of files in public:", modules.public.paths().length);
  }
};

export const test_src = (unit_test) => {
  if (unit_test) {
    console.log("Number of js files in src:", modules.src.js.paths().length);
  }
};

export const test_processors = (unit_test) => {
  if (unit_test) {
    console.log(
      "Number of processors:",
      modules.processors.processors().length
    );
  }
};
