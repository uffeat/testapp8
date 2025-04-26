export default function handler(req, res) {
  // you can inspect req.query, req.body, headers, etc.
  res.status(200).send('From Vercel foo');
}