export default async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      const getResponse = await fetch(`http://localhost:3001/notes/${id}`);
      const note = await getResponse.json();
      if (note) {
        res.status(200).json({ data: note });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    case 'PUT':
      const updatedNote = {
        id,
        title: req.body.title,
        body: req.body.body,
      };
      const putResponse = await fetch(`http://localhost:3001/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
      const noteAfterUpdate = await putResponse.json();
      if (noteAfterUpdate) {
        res.status(200).json({ data: noteAfterUpdate });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    case 'DELETE':
      const deleteResponse = await fetch(`http://localhost:3001/notes/${id}`, {
        method: 'DELETE',
      });
      if (deleteResponse.status === 200) {
        res.status(200).json({ data: {}, message: 'Note deleted.' });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
