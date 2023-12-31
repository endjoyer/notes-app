import Link from 'next/link';

const Note = ({ note, provided, innerRef }) => (
  <div
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    ref={innerRef}
  >
    <Link legacyBehavior href={`/note/${note._id}`} as={`/note/${note._id}`}>
      <a>
        <h2 className="note__title">{note.title}</h2>
      </a>
    </Link>
    <hr />
  </div>
);

export default Note;
