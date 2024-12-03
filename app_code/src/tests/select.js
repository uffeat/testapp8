// select

await (async () => {
  const { create } = await import("rollo/component");
  const { Select } = await import("rolloui/form/input/Select");
  const { Floating } = await import("rolloui/form/Floating");
  const { InvalidFeedback } = await import("rolloui/form/InvalidFeedback");
  const { Label } = await import("rolloui/form/Label");

  const form = create(
    "form.d-flex.flex-column.row-gap-3.p-3",
    { parent: root, noValidate: true },
    create(
      "section",
      {},
      Label({ for_name: "my_choice" }, "My name"),
      Select(
        { name: "my_choice", placeholder: "Please select...", required: true },
        ["First", 1],
        ["Second", 2],
        ["Third", 3]
      ),
      InvalidFeedback({ for_name: "my_choice" })
    ),
    Floating(
      { label: "My style" },
      Select(
        {
          name: "my_style",
          placeholder: "Pick a style...",
          required: true,
          hooks: [
            function () {
              this.effects.add((data) => {
                if (data.value.previous) {
                  this.css_class[`text-bg-${data.value.previous}`] = false;
                }
                if (data.value.current) {
                  this.css_class[`text-bg-${data.value.current}`] = true;
                }
              }, "value");
            },
          ],
        },
        ["Primary", "primary"],
        ["Secondary", "secondary"],
        ["Success", "success"],
        ["Warning", "warning"],
        ["Info", "info"],
        ["Light", "light"],
        ["Dark", "dark"]
      ),
      InvalidFeedback(),
      /* Connect invalid feedback to input; alternative to using for_name */
      function () {
        this.querySelector(".invalid-feedback").form_control =
          this.querySelector("select");
      }
    ),
    create(
      "div.input-group",
      {},
      create("span.input-group-text", {}, "@"),
      Floating(
        { label: "My foo" },
        Select(
          {
            name: "my_foo",
            placeholder: "Please select...",
            required: true,
            ".rounded-end": true,
            
          },
          ["Foo", "foo"],
          ["Bar", "green"],
          ["Stuff", "stuff"]
        )
      ),
      InvalidFeedback({ for_name: "my_foo" })
    )
  );
})();