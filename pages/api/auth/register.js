import User from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      try {
        const newUser = await user.save();
        res.status(201).json(newUser);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
