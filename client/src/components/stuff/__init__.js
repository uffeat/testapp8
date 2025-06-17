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
      this.append(
        component.form(
          "row.g-3.p-3",

          component.div(
            "form-floating.col-md-6",
            { state: true },
            component.input("form-control", {
              type: "email",
              id: "email",
              name: "email",
              placeholder: "Email",
              title: " ",
              required: true,
            }),
            component.label({ for_: "email", text: "Email" }),
            component.p(),

            function () {
              const input = this.find(`input`);
              const message = this.find(`p`);

              const validate = () => {
                if (input.value) {
                  console.log("validity:", input.validity);
                  if (input.validity.typeMismatch) {
                    this.state.$.message = "Invalid format";
                  } else {
                    this.state.$.message = null;
                  }
                } else {
                  this.state.$.message = "Required";
                }
              };

              input.on.input = validate;

              input.on.blur = (event) => {
                validate();
                this.state.$.visited = true;
                input.attribute.visited = true;
              };

              this.state.effects.add((change) => {
                input.classes.if(
                  this.state.$.visited && this.state.$.message,
                  "is-invalid"
                );
              });

              this.state.effects.add((change) => {
                message.text = change.message;
              }, "message");

              validate();
            }
          ),

          component.div(
            "form-floating.col-md-6",
            { state: true },
            component.input("form-control", {
              type: "password",
              id: "password",
              name: "password",
              placeholder: "Password",
              title: " ",
              required: true,
            }),
            component.label({ for_: "password", text: "Password" }),
            component.p(),

            function () {
              const input = this.find(`input`);
              const message = this.find(`p`);

              const validate = () => {
                if (input.value) {
                  this.state.$.message = null;
                } else {
                  this.state.$.message = "Required";
                }
              };

              input.on.input = validate;

              input.on.blur = (event) => {
                validate();
                this.state.$.visited = true;
                input.attribute.visited = true;
              };

              this.state.effects.add((change) => {
                input.classes.if(
                  this.state.$.visited && this.state.$.message,
                  "is-invalid"
                );
              });

              this.state.effects.add((change) => {
                message.text = change.message;
              }, "message");

              validate();
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

      const form = this.find(`form`);
      const submit = this.find(`button`);
      //const email = this.components.email;
      //const password = this.find(`input[name="password"]`);
      //console.log('password:', password)

      this.on.input = (event) => {
        const valid = form.checkValidity();
        submit.classes.if(!valid, "disabled");
      };
    }
  };
};
