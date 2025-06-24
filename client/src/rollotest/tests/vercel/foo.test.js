/*
vercel/foo
*/

console.log(await (await fetch("/api/foo")).text());
