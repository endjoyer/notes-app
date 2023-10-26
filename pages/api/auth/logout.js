export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      res.setHeader('Set-Cookie', ['token=; Max-Age=0;']);
      res.json({ message: 'Logged out' });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
