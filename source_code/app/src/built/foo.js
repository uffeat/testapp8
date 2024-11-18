/* Auto-generated: 2024-11-18 12:04:20 */
export const my_template = "<h1>Hello from template!</h1>"
const my_private_template = "<h1>Hello from private template!</h1>"
export const my_sheet = new CSSStyleSheet();my_sheet.replaceSync("h1 {\n    color: pink;\n  }");document.adoptedStyleSheets.push(my_sheet);

  export function demo(root) {
    root.insertAdjacentHTML("beforeend", my_private_template);
    return root;
  }

  export const foo = "FOO";
//# sourceURL=foo