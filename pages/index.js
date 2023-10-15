import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResizableBox } from 'react-resizable';
import NoteList from '../components/NoteList';

const Home = ({ notes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSortingAscending, setIsSortingAscending] = useState(true);

  const handleSort = () => {
    setIsSortingAscending(!isSortingAscending);
    setSearchResults(
      [...searchResults].sort((a, b) =>
        isSortingAscending
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      )
    );
  };

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
    const results = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <ResizableBox width={200} height={Infinity}>
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
        <button className="btn btn-secondary mb-4 ml-2" onClick={handleSort}>
          Sort
        </button>

        <NoteList notes={searchResults} handleOnDragEnd={handleOnDragEnd} />
      </div>
    </ResizableBox>
  );
};

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/notes');
  const { data } = await res.json();

  return {
    props: { notes: data },
  };
}

export default Home;
