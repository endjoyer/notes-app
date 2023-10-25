import { useEffect, useContext } from 'react';
import axios from 'axios';
import nextCookies from 'next-cookies';
import jwtDecode from 'jwt-decode';
import { NotesContext } from '../context/NotesContext';

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [loading, session]);

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
  const res = await axios.get(`http://localhost:3000/notes?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const initialNotes = res.data;

  return {
    props: { initialNotes },
  };
}

// export async function getServerSideProps() {
//   const res = await fetch('http://localhost:3000/api/notes');
//   const data = await res.json();

//   const initialNotes = Array.isArray(data) ? data : [];

//   return {
//     props: { initialNotes },
//   };
// }
