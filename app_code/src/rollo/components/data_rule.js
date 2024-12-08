import { Component } from "rollo/component";
import {
  attribute,
  connected,
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
} from "rollo/factories/__factories__";

const data_rule = (parent, config, ...factories) => {
  const cls = class DataRule extends parent {
    constructor() {
      super();
    }
  };

  return cls;
};

Component.author(
  "data-rule",
  HTMLElement,
  {},
  attribute,
  connected,
  name,
  properties,
  reactive,
  rule,
  state_to_attribute,
  data_rule
);
