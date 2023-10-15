import { getNoteById, updateNoteById, deleteNoteById } from '../notes';

export default (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      const note = getNoteById(id);
      if (note) {
        res.status(200).json({ data: note });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    case 'PUT':
      const updatedNote = updateNoteById(id, req.body);
      if (updatedNote) {
        res.status(200).json({ data: updatedNote });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    case 'DELETE':
      const deletedNote = deleteNoteById(id);
      if (deletedNote) {
        res.status(200).json({ data: deletedNote });
      } else {
        res.status(404).json({ message: 'Note not found.' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
