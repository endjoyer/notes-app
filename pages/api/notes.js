// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const notes = [
  { id: '1', title: 'Note 1', body: 'This is note 1' },
  { id: '2', title: 'Note 2', body: 'This is note 2' },
  { id: '3', title: 'Note 3', body: 'This is note 3' },
];

export default (req, res) => {
  res.status(200).json({ data: notes });
};
