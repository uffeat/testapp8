import { author } from "@/rollo/component/tools/author";
import { registry } from "@/rollo/component/tools/registry";

const key = `bar-component`
const tag = `div`


class cls extends author(tag) {
  constructor() {
    super();
  }
}

const options = {extends: 'div'}

registry.add(cls, key, tag)
