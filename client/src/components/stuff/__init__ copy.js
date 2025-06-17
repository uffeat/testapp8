const { Base, State, component } = await use("@/rollocomponent/");
const { reboot } = await use("@/rollolibs/bootstrap/reboot.js");
const { bootstrap } = await use("@/rollolibs/bootstrap/bootstrap.js");

export default async (assets) => {
  assets["sheet.css"].adopt(document);

  return class extends Base {
    static __tag__ = "rollo-stuff";

    constructor() {
      super();
      this.shadow.sheets.add(reboot);

      //this.shadow.insert.beforeend(assets["template.html"]);
    }

    __new__() {
      //this.host = true;
      //this.state = true

      this.append(
        component.form(
          "row.g-3.p-3",
          {
            //key: "form",
            //novalidation: true,
          },
          component.div(
            "form-floating.col-md-6",
            {},
            component.input("form-control", {
              key: "email",
              type: "email",
              id: "email",
              name: "email",
              placeholder: "Email",
              title: " ",
              "@blur": function (event) {
                this.attribute.visited = true;
              },
            }),
            component.label({ for_: "email", text: "Email" }),
            component.p()
          ),
          component.div(
            "form-floating.col-md-6",
            { host: true, state: true },
            component.input("form-control", {
              key: "input",
              type: "password",
              id: "password",
              name: "password",
              placeholder: "Password",
              title: " ",
            }),
            component.label({ for_: "password", text: "Password" }),
            component.p({ key: "message" }),

            function () {
              const input = this.components.input;
              const message = this.components.message;

              const validate = () => {
                if (input.value) {
                  this.state.$.message = null;
                  input.setCustomValidity("");
                } else {
                  this.state.$.message = "Required";
                  input.setCustomValidity(" ");
                }
                //console.log('validity:', input.validity)
              };

              input.on.input = (event) => {
                validate()
                
              };

              input.on.blur = (event) => {
                validate()
                this.state.$.visited = true;
                input.attribute.visited = true;
              };

              this.state.effects.add((change) => {
                console.log("visited:", this.state.$.visited); ////
                console.log("message:", this.state.$.message); ////

                if (this.state.$.visited && this.state.$.message) {
                  input.classes.add("is-invalid");
                } else {
                  input.classes.remove("is-invalid");
                }
              });

              message.update({
                text: () => {
                  this.state.effects.add((change) => {
                    message.text = change.message;
                  }, "message");
                  return "Required";
                },
              });
            }
          ),
          component.menu(
            component.button(
              "btn.btn-primary.disabled",
              {
                key: "submit",
                type: "button",
                "@click": (event) => {
                  console.log("Clicked");
                },
              },
              "Submit"
            )
          )
        )
      );

      //const form = this.components.form;
      //const email = this.components.email;
      //const password = this.components.password;

      this.on.input = (event) => {
        return;
        if (event.target.value) {
          event.target.attribute.empty = null;
        } else {
          event.target.attribute.empty = true;
        }
        //console.log('value:', event.target.value)
      };
    }
  };
};
