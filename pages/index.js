import { useEffect, useContext } from 'react';
import axios from 'axios';
import nextCookies from 'next-cookies';
import { NotesContext } from '../context/NotesContext';

const Home = ({ initialNotes }) => {
  const { setNotes } = useContext(NotesContext);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  return (
    <main className="main">
      <h1 className="main__title">Notes</h1>
    </main>
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
  const res = await axios.get('http://localhost:3000/notes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const initialNotes = res.data;

  return {
    props: { initialNotes },
  };
}

export default Home;
