import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import nextCookies from 'next-cookies';
import { NotesContext } from '../../context/NotesContext';
import Loader from '../../components/Loader';

const NotePage = ({ note, initialNotes }) => {
  const router = useRouter();
  const { id } = router.query;
  const { notes, setNotes } = useContext(NotesContext);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  // useEffect(() => {
  //   const fetchNote = async () => {
  //     const res = await axios.get(`http://localhost:3000/notes/${id}`, {
  //       headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  //     });
  //     const fetchedNote = res.data;
  //     setNotes(fetchedNote);
  //   };

  //   if (notes.length === 0) {
  //     fetchNote();
  //   }
  // }, [id, notes.length, setNotes]);

  const deleteNote = async () => {
    try {
      await axios.delete(`http://localhost:3000/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
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

export async function getServerSideProps(context) {
  const { token } = nextCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { id } = context.params;

  const responseNote = await axios.get(`http://localhost:3000/notes/${id}`, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  });
  const note = responseNote.data;

  const responseNotes = await axios.get('http://localhost:3000/notes', {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  });
  const initialNotes = responseNotes.data;

  return {
    props: { note, initialNotes },
  };
}

export default NotePage;
