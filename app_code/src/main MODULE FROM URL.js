import "./bootstrap.scss";
import "./main.css";


import url from '@/test/test.js?url'



function construct_module(url) {
  
  return new Function(`return import("${url}")`)();
}

//const js_module = await construct_module(`public/test.js`);
const js_module = await construct_module(url);
const { test } = js_module;
test();


