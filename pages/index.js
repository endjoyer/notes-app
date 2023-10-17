import { useSession, getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [loading, session]);

  if (loading || !session) {
    return <div>Loading...</div>;
  }
  return (
    <main className="main">
      <h1 className="main__title">Welcome, {session.user.username}!</h1>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const res = await fetch(
    `http://localhost:3000/api/notes?user=${session.user.id}`
  );
  const data = await res.json();

  const initialNotes = Array.isArray(data) ? data : [];

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
