const { Base, component } = await use("@/rollocomponent/");
const { reboot } = await use("@/rollolibs/bootstrap/reboot.js");

export default async (assets, { components }) => {
  assets["sheet.css"].adopt(document);

  const cls = class extends Base {
    static __tag__ = "rollo-stuff";

    constructor() {
      super();
      this.shadow.sheets.add(reboot);
    }

    __new__() {
      this.append(component.h1({}, "STUFF"));
    }
  };

  return cls;
};
