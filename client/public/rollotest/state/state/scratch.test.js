/*
state/state/scratch
*/


import { State } from "@/rollostate/state.js";

const state = new State({initial: {foo: 42, bar: 8}})

state.effects.add((change, {effect, index, state}) => {
  //console.log('change:', change)
  //console.log('index:', index)
  //console.log('session:', state.session)
}, {run: true})

state.effects.add((change, {effect, index, state}) => {
  //console.log('change:', change)
}, ['foo'])

state.effects.add((change, {effect, index, state}) => {
  console.log('running')
}, ['bar'], (change) => change.foo === 0)

state.$.foo = 43

state.update({foo: 'FOO', bar: 8})


state.update({foo: 0, bar: 'BAR'})
