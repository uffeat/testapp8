/*
rollovite/assets
*/

const { component } = await use("@/rollo/component/component.js");

component.img({ src: await assets("images/bevel.jpg"), parent: document.body });
component.img({ src: "/images/sprocket.jpg", parent: document.body });
