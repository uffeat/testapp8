import mix from "@/rollostate/tools/mix.js";
import effects from "@/rollostate/mixins/effects.js";
import update from "@/rollostate/mixins/update.js";

const cls = class {
  constructor() {}
};

export default mix(cls, {}, effects, update);
