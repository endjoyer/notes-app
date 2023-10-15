import NoteList from '../components/NoteList';

const Home = ({ notes }) => (
  <div>
    <h1>Notes</h1>
    <NoteList notes={notes} />
  </div>
);

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/notes');
  const { data } = await res.json();

  return {
    props: { notes: data },
  };
}

export default Home;
