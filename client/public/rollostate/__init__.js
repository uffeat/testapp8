/*
const { Ref, State } = await use("/rollostate/");
*/

const { Ref } = await use("/rollostate/ref.js");
const { State } = await use("/rollostate/state.js");

export { Ref, State };
