/*
serverless/bar
*/

console.log(await (await fetch("/api/bar")).text());
