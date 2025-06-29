/*
import { build } from "@/rolloapp/tools/assets.js";
20250626
v.1.0
*/

import { Sheet } from "@/rollosheet/tools/sheet.js";

export const build = async (wrapper, { path } = {}) => {
  /* Build assets */
  const assets = {};
  /* Named sheets */
  for (const element of wrapper.querySelectorAll("style[name]")) {
    const name = element.getAttribute("name");
    const sheet = new Sheet(element.textContent, {
      name: `${path.path}/${name}`,
    });
    assets[name] = sheet;
    /* Global sheets */
    if (element.hasAttribute("global")) {
      sheet.adopt(document);
    }
  }
  /* Unnamed global sheets */
  for (const element of wrapper.querySelectorAll("style[global]:not([name])")) {
    new Sheet(element.textContent).adopt(document);
  }

  /* Sheets from src 
          NOTE Injected as links. Not included in 'assets'. */
  for (const element of wrapper.querySelectorAll("style[src]")) {
    const src = element.getAttribute("src");
    await use(src);
  }
  /* Templates 
          NOTE Templates can contain (unnamed) styles. These are not sheet-processed. 
          Can be useful for shadow templates.  */
  for (const element of wrapper.querySelectorAll("template")) {
    if (!element.hasAttribute("name")) {
      throw new Error(`Unnamed <template> in ${path.path}`);
    }
    const name = element.getAttribute("name");
    const html = element.innerHTML;
    assets[name] = html;
  }
  return assets;
};
