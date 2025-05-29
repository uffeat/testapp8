import mix from "@/rollostate/tools/mix.js";
import effects from "@/rollostate/types/list/mixins/effects.js";
import name from "@/rollostate/mixins/name.js";
import owner from "@/rollostate/mixins/owner.js";
import update from "@/rollostate/types/list/mixins/update.js";



export default mix({}, effects, name, owner, update);
