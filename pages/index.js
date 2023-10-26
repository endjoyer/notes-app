import { useEffect, useContext } from 'react';
import axios from 'axios';
import nextCookies from 'next-cookies';
import jwtDecode from 'jwt-decode';
import { NotesContext } from '../context/NotesContext';
import { SERVER_URL } from '../utils/constants';

const Home = ({ initialNotes }) => {
  const { setNotes } = useContext(NotesContext);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  return <h1 className="main__title">Notes</h1>;
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

  const { userId } = jwtDecode(token);
  const res = await axios.get(`${SERVER_URL}/api/notes?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const initialNotes = res.data;

  return {
    props: { initialNotes },
  };
}

export default Home;
