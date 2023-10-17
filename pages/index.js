import { useEffect, useContext } from 'react';
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

export async function getStaticProps() {
  const res = await fetch('http://localhost:3001/notes');
  const initialNotes = await res.json();

  return {
    props: { initialNotes },
    revalidate: 1,
  };
}

export default Home;
