import Note from '../../../models/Note';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  console.log('ачало');
  switch (method) {
    case 'GET':
      try {
        const notes = await Note.find({ userId: req.query.userId });
        res.status(200).json(notes);
        console.log('GET');
      } catch (err) {
        console.log('GET err');
        res.status(500).json({ message: err.message });
      }
      break;
    case 'POST':
      const note = new Note({
        title: req.body.title,
        body: req.body.body,
        userId: req.body.userId,
        position: (await Note.countDocuments({})) - 2,
      });

      try {
        const newNote = await note.save();
        res.status(201).json(newNote);
        console.log('POST');
      } catch (err) {
        console.log('POST err');
        res.status(400).json({ message: err.message });
      }
      break;
    default:
      console.log('говно');
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
