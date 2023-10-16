import Link from 'next/link';

const Note = ({ note, provided, innerRef }) => (
  <div
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    ref={innerRef}
  >
    <Link legacyBehavior href={`/note/${note.id}`} as={`/note/${note.id}`}>
      <a>
        <h2>{note.title}</h2>
      </a>
    </Link>
    <hr />
  </div>
);

export default Note;
