import Note from '../../../models/Note';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const note = await Note.findById(id);
        if (note == null) {
          return res.status(404).json({ message: 'Cannot find note' });
        }
        res.json(note);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
      break;
    case 'PUT':
      try {
        const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (updatedNote == null) {
          return res.status(404).json({ message: 'Cannot find note' });
        }
        res.json(updatedNote);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
      break;
    case 'DELETE':
      try {
        const deletedNote = await Note.findByIdAndRemove(id);
        if (deletedNote == null) {
          return res.status(404).json({ message: 'Cannot find note' });
        }
        res.json({ message: 'Note deleted' });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
