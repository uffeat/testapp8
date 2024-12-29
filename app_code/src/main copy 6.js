import "./bootstrap.scss";
import "./main.css";

//import html from "@/test/test.html?raw";
import url from "@/test/test.html?url";

//console.log(html);

const iframe = await new Promise((resolve, reject) => {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  document.body.append(iframe);
  const onload = (event) => resolve(iframe);
  iframe.onload = onload;
});

console.log(iframe.contentDocument);
