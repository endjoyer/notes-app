export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const response = await fetch('http://localhost:3001/notes');
      const notes = await response.json();
      res.status(200).json({ data: notes });
      break;
    case 'POST':
      const note = {
        id: Date.now().toString(),
        title: req.body.title,
        body: req.body.body,
      };
      const postResponse = await fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      const newNote = await postResponse.json();
      res.status(201).json({ data: newNote });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
