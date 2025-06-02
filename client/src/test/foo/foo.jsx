import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/libs/catalyst/button.jsx'

import { component } from "@/rollocomponent/component.js";

const root = createRoot(component.div({parent: document.body}));
root.render(<Button color="cyan">Save changes</Button>);


