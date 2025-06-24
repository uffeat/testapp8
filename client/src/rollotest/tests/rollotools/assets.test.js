/*
rollotools/assets
*/

const { component } = await use("@/rollocomponent/");
const { assets } = await use("@/rollotools/assets.js");

component.img({ src: await assets("images/bevel.jpg"), parent: app });
component.img({ src: "/images/sprocket.jpg", parent: app });
