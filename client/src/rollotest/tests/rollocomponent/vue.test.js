import { component } from "@/rollocomponent/component.js";

import { createApp } from 'vue'
import foo from '@/test/foo/foo.vue'

createApp(foo).mount(component.div({id: 'vue', parent: document.body}))