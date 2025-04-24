/* Tests, if target can (likely) adopt sheets. */
export const is_sheet_target = (target) => {
  return (
    target === document ||
    target instanceof ShadowRoot ||
    target.adoptedStyleSheets
  );
}