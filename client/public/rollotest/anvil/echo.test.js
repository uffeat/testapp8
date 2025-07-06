/*
anvil/echo
*/



/* Test */
anvil.server
  .echo({ number: 42 })
  .then((response) => console.log("server response:", response));

anvil.client
  .echo({ number: 42 })
  .then((response) => console.log("client response:", response));

  anvil.client
  .echo({ number: 42 })
  .then((response) => {
    console.log("client submission:", anvil.client.submission);
    console.log("client response:", response)
  });

