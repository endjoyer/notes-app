import Note from './Note';

const NoteList = ({ notes }) => (
  <div>
    {notes.map((note) => (
      <Note key={note.id} note={note} />
    ))}
  </div>
);

export default NoteList;
