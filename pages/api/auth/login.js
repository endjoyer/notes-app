import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token, userId: user.id });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
