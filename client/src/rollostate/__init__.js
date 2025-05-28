import _State from '@/rollostate/types/state.js'

export const State = (...effects) => {

  const instance = new _State()
  effects.forEach((effect) => instance.effects.add(effect))

  return instance

}