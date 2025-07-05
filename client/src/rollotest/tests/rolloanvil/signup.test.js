const { AnvilComponent } = await use("@/rolloanvil/component.js");

const signup = AnvilComponent('h-screen', { src: "signup", parent: app });

signup.channels.add("user", (data) => {
  console.log("user channel got data:", data);
  signup.remove()
});

await signup.connect();


