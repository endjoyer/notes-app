import { useState, useEffect, useContext } from 'react';
import { ResizableBox } from 'react-resizable';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NotesContext } from '../context/NotesContext';
import { useRouter } from 'next/router';

const DynamicNoteList = dynamic(() => import('./NoteList'), {
  ssr: false,
});

const Layout = ({ children }) => {
  const { notes, setNotes } = useContext(NotesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [resizableBoxWidth, setResizableBoxWidth] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isLogOrRegPage =
    router.pathname === '/login' || router.pathname === '/register';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 700);
    }
  }, []);

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(searchResults);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSearchResults(items);

    const token = Cookies.get('token');
    await axios.put(
      `/api/notes/${reorderedItem._id}/position`,
      { position: result.destination.index },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleLogout = async () => {
    await axios.post(`/api/auth/logout`);
    Cookies.remove('token');
    router.push('/login');
  };

  useEffect(() => {
    setSearchResults(notes);
  }, [notes]);

  useEffect(() => {
    const results = notes.filter((note) =>
      note.title ? note.title.toLowerCase().includes(searchTerm) : false
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <>
      <div className="layout__container">
        {isMobile ? (
          <div id="menuToggle">
            <input
              className="hamburger-input"
              type="checkbox"
              checked={isMenuOpen}
              onChange={() => setIsMenuOpen(!isMenuOpen)}
            />
            <span></span>
            <span></span>
            <span></span>
            <div
              id="menu"
              style={{ transform: isMenuOpen ? 'none' : 'translate(-100%, 0)' }}
            >
              <h1 className="my-4">Notes</h1>
              <div className="btns__container">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
                <Link legacyBehavior href="/new">
                  <a className="btn btn-primary">New Note</a>
                </Link>
              </div>
              <input
                type="text"
                className="form-control my-4"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <DynamicNoteList
                notes={searchResults}
                handleOnDragEnd={handleOnDragEnd}
              />
            </div>
          </div>
        ) : (
          <ResizableBox
            className=""
            width={resizableBoxWidth}
            height={Infinity}
            minConstraints={[200, Infinity]}
            maxConstraints={[500, Infinity]}
            resizeHandles={['e']}
            onResize={(event, data) => {
              setResizableBoxWidth(data.size.width);
            }}
          >
            <div
              className={`container layout__contend ${
                isLogOrRegPage && 'layout__contend_none'
              }`}
            >
              <h1 className="my-4">Notes</h1>
              <div className="btns__container">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
                <Link legacyBehavior href="/new">
                  <a className="btn btn-primary">New Note</a>
                </Link>
              </div>
              <input
                type="text"
                className="form-control my-4"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <DynamicNoteList
                notes={searchResults}
                handleOnDragEnd={handleOnDragEnd}
              />
            </div>
          </ResizableBox>
        )}
        <main
          className="main"
          style={
            !isMobile && !isLogOrRegPage
              ? { marginLeft: resizableBoxWidth }
              : {}
          }
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
