// component_html
import { create } from "component/component";
import { assets } from "utils/assets";

const foo_html = await assets.get("foo.html");

const component = create('div', {parent: root}, foo_html)

console.log(component);