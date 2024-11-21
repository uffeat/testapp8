import { create } from "@/rollo";

export function Button({style, ...props}, ...children) {
  const component = create('button.btn', props, ...children)
  if (style) {
    component.classList.add(`.btn-${style}`)
  }
  


  return component

}