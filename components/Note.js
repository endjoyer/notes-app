import Link from 'next/link';

const Note = ({ note }) => (
  <div>
    <Link href="/note/[id]" as={`/note/${note.id}`}>
      <a>
        <h2>{note.title}</h2>
      </a>
    </Link>
    <hr />
  </div>
);

export default Note;
