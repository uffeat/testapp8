
import { url } from  "@/rollovite/url.js";
import { component } from "@/rollo/component/component.js";




component.img({src: (await url("@/assets/images/bevel.jpg")), parent: document.body})
component.img({src: (url("/images/sprocket.jpg")), parent: document.body})

