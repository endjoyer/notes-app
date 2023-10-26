import { SERVER_URL } from '../../utils/constants';
export default async (req, res) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/notes`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response.status).json({ message: err.message });
  }
};
