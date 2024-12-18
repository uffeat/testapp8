import "./bootstrap.scss";
import "./main.css";

import { type } from "rollo/type/type";
import "rollo/type/types/data/data";

const data_0 = type.create('data', {foo: 'FOO', bar: 'BAR', stuff: 42, thing: 42})
console.log('data_0.type:', data_0.type)
//console.log('data_0.__class__:', data_0.__class__)
const data_1 = data_0.clone()

data_0.foo = 'foo'
data_0.update([['foo', 'FOOFOO']])
//console.log('data_0.entries:', data_0.entries)
//data_0.reset(true)
//data_0.clear()
data_0.transform(([k, v]) => {
  if (typeof v === 'number') {
    return [k, 2*v]
  } else {
    return [k, v]
  }
})

//data_0.filter(([k, v]) => typeof v !== 'number')

/*
data_0.transform(([k, v]) => {
  if (typeof v === 'number') {
    return [k, undefined]
  } else {
    return [k, v]
  }
})
data_0.clean()
*/



const value = data_0.reduce(
  (data) => data.filter(([k, v]) => typeof v === 'number'),
  (items) => items.values,
  (values) => {
    let sum = 0
    values.forEach(v => sum += v)
    return sum
  }

)
console.log('value:',value)





console.log('data_0:',data_0)
console.log('data_1:',data_1)




/* Enable tests */
if (import.meta.env.DEV) {
  let path = "";
  window.addEventListener("keydown", async (event) => {
    if (event.code === "KeyT" && event.shiftKey) {
      path = prompt("Path:", path);
      await import(`./tests/${path}.js`);
    }
  });
}
