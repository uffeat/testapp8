// import { capitalize } from "@/rollo/tools/text/capitalize";
// const { capitalize } = await import("@/rollo/tools/text/capitalize");

export const capitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
};
