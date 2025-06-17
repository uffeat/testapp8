/*
const Stuff = await components.import("stuff/");
*/

const { Base, component } = await use("@/rollocomponent/");

export default async (assets) => {

  /* Make parcel sheet global */
  assets["sheet.css"].adopt(document);

  return class extends Base {
    static __tag__ = "rollo-stuff";

    constructor() {
      super();
    }

    __new__() {
      this.append(
        component.form(
          "row.g-3.p-3",
          component.div(
            "form-floating.col-md-6",
            {
              state: true,
            },
            component.input("form-control", {
              type: "email",
              id: "email",
              name: "email",
              placeholder: "Email",
              title: " ",
              required: true,
            }),
            component.label({
              for_: "email",
              text: "Email",
              __marginLeft: '0.25rem',
            }),
            component.p(),

            function () {
              const [input, message] = [this.find(`input`), this.find(`p`)];

              const validate = () => {
                if (input.value) {
                  this.state.$.message = input.validity.typeMismatch
                    ? "Invalid format"
                    : null;
                } else {
                  this.state.$.message = "Required";
                }
              };

              input.on.input = validate;

              input.on.blur = (event) => {
                validate();
                this.state.$.visited = input.attribute.visited = true;
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
            {
              state: true,
            },
            component.input("form-control", {
              type: "password",
              id: "password",
              name: "password",
              placeholder: "Password",
              title: " ",
              required: true,
            }),
            component.label({
              for_: "password",
              text: "Password",
              __marginLeft: '0.25rem',
            }),
            component.p(),

            function () {
              const [input, message] = [this.find(`input`), this.find(`p`)];

              const validate = () => {
                this.state.$.message = input.value ? null : "Required";
              };

              input.on.input = validate;

              input.on.blur = (event) => {
                validate();
                this.state.$.visited = input.attribute.visited = true;
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
            component.button("btn.btn-primary.disabled", {}, "Submit")
          )
        )
      );

      const form = this.find(`form`);
      const submit = this.find(`button`);
      const email = this.find(`input[name="email"]`);
      const password = this.find(`input[name="password"]`);

      this.on.input = (event) => {
        const valid = form.checkValidity();
        submit.classes.if(!valid, "disabled");
      };

      form.on.submit = (event) => {
        event.preventDefault();

        const data = {
          [email.name]: email.value,
          [password.name]: password.value,
        };
        /* TODO Call endpoint and show any errors */
      };
    }
  };
};
