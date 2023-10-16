import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NotesContext } from '../../context/NotesContext';

const NotePage = ({ note }) => {
  const router = useRouter();
  const { id } = router.query;
  const { notes, setNotes } = useContext(NotesContext);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`http://localhost:3001/notes/${id}`);
      const note = await res.json();
      setNotes((prevNotes) => [
        ...prevNotes.filter((note) => note.id !== id),
        note,
      ]);
    };

    if (notes.length === 0) {
      fetchNote();
    }
  }, [id]);

  const deleteNote = async () => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      {note ? (
        <>
          <h1 className="my-4">{note.title}</h1> <p>{note.body}</p>
          <Link legacyBehavior href={`${id}/edit`}>
            <a className="btn btn-primary">Edit</a>
          </Link>
          <button
            onClick={deleteNote}
            className="btn btn-danger"
            style={{ marginLeft: '10px' }}
          >
            Delete
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3001/notes');
  const notes = await res.json();

  const paths = notes.map((note) => ({
    params: { id: note.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3001/notes/${params.id}`);
  const note = await res.json();

  return { props: { note }, revalidate: 1 };
}

export default NotePage;
