/*
 rollocomponent/handlers
*/

import { component } from "@/rollocomponent/component.js";

const menu = component.menu(
  "flex.gap-x-3",
  { parent: document.body, host: true },

  /*  Set up in updates */
  component.button(
    "btn.btn-primary",
    {
      "@click": (event) => console.log("Clicked!"),
    },
    "Click"
  ),

  /* Set up with explicit handler */
  component.button("btn.btn-primary", {}, "Click").handlers.add({
    click: (event) => console.log("Clicked!"),
  }),

  /* Set up in hook */
  component.button("btn.btn-primary", {}, "Click", function () {
    this.on.click = (event) => console.log("Clicked!");
  }),

  /* Set up with trailing 'on' and iife
  NOTE Just demo - NOT typical! */
  (() => {
    const button = component.button("btn.btn-primary", {}, "Click");
    button.on.click = (event) => console.log("Clicked!");
    return button;
  })(),

  /* Set up in updates with __setup__
  NOTE Just demo - NOT typical! To work, top=level component must be 'host' */
  component.button(
    "btn.btn-primary",
    {
      __setup__: function () {
        this.on.click = (event) => console.log("Clicked!");
      },
    },
    "Click"
  ),

  /* Set up in updates with function value.
  NOTE Just demo - NOT typical! function values in updates are intended 
  for state-driven trees. */
  component.button(
    "btn.btn-primary",
    {
      _: function () {
        this.on.click = (event) => console.log("Clicked!");
      },
    },
    "Click"
  ),

  /* Set up in host hook
  NOTE Just demo - NOT typical! To work, top-level component must be 'host' 
  and button must have 'key' */
  component.button("btn.btn-primary", { key: "button" }, "Click"),
  function () {
    this.components.button.on.click = (event) => console.log("Clicked!");
  },

  /* With 'run' dir in updates */
  component.button(
    "btn.btn-primary",
    {
      "@click$run": (event) => console.log("Clicked!"),
    },
    "Runs"
  ),

  /* With 'run' dir in hook */
  component.button("btn.btn-primary", {}, "Runs", function () {
    this.on.click$run = (event) => console.log("Clicked!");
  }),

  /* With 'run' dir from explicit handler */
  component.button("btn.btn-primary", {}, "Runs").handlers.add({
    click$run: (event) => console.log("Clicked!"),
  }),

  /* With 'once' dir in updates */
  component.button(
    "btn.btn-primary",
    {
      "@click$once": (event) => console.log("Clicked!"),
    },
    "Once"
  ),

  /* With 'once' dir in hook */
  component.button("btn.btn-primary", {}, "Once", function () {
    this.on.click$once = (event) => console.log("Clicked!");
  }),

  /* With 'once' dir from explicit handler */
  component.button("btn.btn-primary", {}, "Once").handlers.add({
    click$once: (event) => console.log("Clicked!"),
  })
);
