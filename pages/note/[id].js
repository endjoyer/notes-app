import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { NotesContext } from '../../context/NotesContext';
import Loader from '../../components/Loader';

const NotePage = ({ note }) => {
  const router = useRouter();
  const { id } = router.query;
  const { notes, setNotes } = useContext(NotesContext);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`/api/notes/${id}`);
      const note = await res.json();
      setNotes((prevNotes) => [
        ...prevNotes.filter((note) => note.id !== id),
        note,
      ]);
    };

    if (notes.length === 0) {
      fetchNote();
    }
  }, [id, notes.length, setNotes]);

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
        <Loader />
      )}
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/notes/${params.id}`);
  const data = await res.json();

  const note = Array.isArray(data) ? data[0] : data;

  return { props: { note } };
}

export default NotePage;
