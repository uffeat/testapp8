// import { starts_with_upper } from "@/rollo/tools/text/starts_with_upper";
// const { starts_with_upper } = await import("@/rollo/tools/text/starts_with_upper");

export const starts_with_upper = (text) => {
  return /^[A-Z]/.test(text.charAt(0));
}
