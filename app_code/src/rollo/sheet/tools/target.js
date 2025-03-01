// import { adopt, has, is_target, unadopt } from "@/rollo/tools/sheet/tools/target";
// const { adopt, has, is_target, unadopt } = await import("@/rollo/tools/sheet/tools/target");

/* Adopts sheets to target. Returns target. 
NOTE
- Does (intentionally) NOT check, if sheet already adopted, i.e., risk of 
  over-adoption. Such responsibility should be assumed by, e.g., 'has'
  or the TargetsType controller. */
export function adopt(target, ...sheets) {
  target.adoptedStyleSheets.push(...sheets);
  return target;
}

/* Tests, if target has adopted sheet. */
export function has(target, sheet) {
  const adopted = target.adoptedStyleSheets;
  for (const _sheet of adopted) {
    if (_sheet === sheet) {
      return true;
    }
  }
  return false;
}

/* Tests, if target can adopt sheets. */
export function is_target(target) {
  return (
    target === document ||
    target instanceof ShadowRoot ||
    target.adoptedStyleSheets
  );
}

/* Unadopts sheets from target. Returns target. */
export function unadopt(target, ...sheets) {
  const adopted = target.adoptedStyleSheets;
  sheets.forEach((sheet) => {
    const index = adopted.indexOf(sheet);
    if (index !== -1) {
      adopted.splice(index, 1);
    }
  });
  return target;
}
