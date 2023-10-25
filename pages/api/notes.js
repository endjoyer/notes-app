// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/notes', {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response.status).json({ message: err.message });
  }
};
