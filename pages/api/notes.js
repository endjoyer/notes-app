let notes = [];

export default (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json({ data: notes });
      break;
    case 'POST':
      const note = {
        id: Date.now().toString(),
        title: req.body.title,
        body: req.body.body,
      };
      notes.push(note);
      res.status(201).json({ data: note });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export function getNoteById(id) {
  return notes.find((n) => n.id === id);
}

export function updateNoteById(id, updatedNote) {
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex > -1) {
    notes[noteIndex] = { ...notes[noteIndex], ...updatedNote };
    return notes[noteIndex];
  }
}

export function deleteNoteById(id) {
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex > -1) {
    const note = notes.splice(noteIndex, 1);
    return note[0];
  }
}
