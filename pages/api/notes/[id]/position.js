import dbConnect from '../../../../utils/dbConnect';
import Note from '../../../../models/Note';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const note = await Note.findById(id);
        if (note == null) {
          return res.status(404).json({ message: 'Cannot find note' });
        }

        const oldPosition = note.position;
        const newPosition = req.body.position;

        if (oldPosition < newPosition) {
          await Note.updateMany(
            { position: { $gt: oldPosition, $lte: newPosition } },
            { $inc: { position: -1 } }
          );
        } else {
          await Note.updateMany(
            { position: { $lt: oldPosition, $gte: newPosition } },
            { $inc: { position: 1 } }
          );
        }

        note.position = newPosition;
        await note.save();

        res.json(note);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
