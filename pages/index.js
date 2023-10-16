import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { ResizableBox } from 'react-resizable';
import dynamic from 'next/dynamic';
import { NotesContext } from '../context/NotesContext';

const DynamicNoteList = dynamic(() => import('../components/NoteList'), {
  ssr: false,
});

const Home = ({ initialNotes }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(searchResults);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSearchResults(items);
  };

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  useEffect(() => {
    setSearchResults(notes);
  }, [notes]);

  useEffect(() => {
    const results = notes.filter((note) =>
      note.title ? note.title.toLowerCase().includes(searchTerm) : false
    );
    setSearchResults(results);
  }, [searchTerm]);
  console.log(notes);
  console.log(searchResults);

  return (
    <ResizableBox
      width={200}
      height={Infinity}
      minConstraints={[200, Infinity]}
      maxConstraints={[500, Infinity]}
      resizeHandles={['e']}
    >
      <div className="container">
        <h1 className="my-4">Notes</h1>
        <Link legacyBehavior href="/new">
          <a className="btn btn-primary mb-4">New Note</a>
        </Link>
        <input
          type="text"
          className="form-control my-4"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />
        <DynamicNoteList
          notes={searchResults}
          handleOnDragEnd={handleOnDragEnd}
        />
      </div>
    </ResizableBox>
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
