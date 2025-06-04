import { component } from "@/rollocomponent/component.js";

import { component } from "@/rollocomponent/component.js";

import { createApp } from 'vue'
import foo from '@/test/foo/foo.vue'

const vm = createApp(foo).mount(component.div({id: 'vue', parent: document.body}))

console.log("vm:", vm)

vm.increment();

