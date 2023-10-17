import dbConnect from '../../utils/dbConnect';
import Note from '../../models/Note';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const notes = await Note.find({});
        res.status(200).json({ success: true, data: notes });
      } catch (error) {
        res.status(400).json(error.message);
      }
      break;
    case 'POST':
      try {
        const note = await Note.create(req.body);
        res.status(201).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json(error.message);
      }
      break;
    default:
      res.status(400).json(error.message);
      break;
  }
}
