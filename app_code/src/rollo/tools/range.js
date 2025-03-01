// import { range } from "@/rollo/tools/range";
// const { range } = await import("@/rollo/tools/range");

/* Returns filled array. */
export const range = (start, end, step) => {
  const range = [];
  if (end === null || end === undefined) {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i++) {
    if (step) {
      if (typeof step === "function") {
        const result = step(i, start, end, range);
        if (result !== undefined) {
          range.push(result);
        }
      } else {
        range.push(i * step);
      }
    } else {
      range.push(i);
    }
  }
  return range;
};

