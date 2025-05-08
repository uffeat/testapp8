/*
brython/hello
*/

import { brython } from "@/rollobrython/brython.js";




export const test_import = async (unit_test) => {
  if (!unit_test) return

  const stuff = await brython.import('main/development/tests/brython/hello')
  //console.log('text:', text) ////

}

export const test_run = (unit_test) => {
  if (!unit_test) return
  
  brython.run('print("Hello")');
}



