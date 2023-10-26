import axios from 'axios';
import { SERVER_URL } from '../../../utils/constants';

export default async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(`${SERVER_URL}/api/notes/${id}`, {
          headers: { Authorization: req.headers.authorization },
        });
        res.status(200).json(response.data);
      } catch (err) {
        res.status(err.response.status).json({ message: err.message });
      }
      break;
    case 'PUT':
      try {
        const response = await axios.put(
          `${SERVER_URL}/api/notes/${id}`,
          req.body,
          {
            headers: { Authorization: req.headers.authorization },
          }
        );
        res.status(200).json(response.data);
      } catch (err) {
        res.status(err.response.status).json({ message: err.message });
      }
      break;
    case 'DELETE':
      try {
        await axios.delete(`${SERVER_URL}/api/notes/${id}`, {
          headers: { Authorization: req.headers.authorization },
        });
        res.status(200).json({ message: 'Note deleted.' });
      } catch (err) {
        res.status(err.response.status).json({ message: err.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
