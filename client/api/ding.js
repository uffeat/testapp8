export default function handler(request, response) {
  // you can inspect request.query, request.body, headers, etc.
  response.status(200).send('DING');
}