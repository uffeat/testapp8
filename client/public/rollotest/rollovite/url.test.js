/*
preview/url
*/

const { url } = await use("@/rollovite/url.js");
const { component } = await use("@/rollo/component/component.js");

component.img({ src: await url("@/images/bevel.jpg"), parent: document.body });
component.img({ src: url("/images/sprocket.jpg"), parent: document.body });
