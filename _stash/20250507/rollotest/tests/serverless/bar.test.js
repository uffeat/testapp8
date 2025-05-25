/*
vercel/bar
*/

export const test = async (unit_test) => {
  console.log(await (await fetch("/api/bar")).text());
};
