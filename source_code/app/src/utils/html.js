/* Enables html linting via VS Code plugin. */
export function html(strings, ...values) {
  return strings.reduce(
    (result, str, i) => result + str + (values[i] || ""),
    ""
  );
}

/* 
EXAMPLE

const heading = html`<h1>Hello world!</h1>`
 */
