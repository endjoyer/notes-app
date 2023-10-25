import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import nextCookies from 'next-cookies';
import jwtDecode from 'jwt-decode';
import { NotesContext } from '../context/NotesContext';
import Loader from '../components/Loader';

const NewNote = ({ initialNotes }) => {
  const [form, setForm] = useState({
    title: '',
    body: '',
    userId: Cookies.get('token'),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { notes, setNotes } = useContext(NotesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      await createNote();
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const validate = () => {
    let err = {};
    if (!form.title) {
      err.title = 'Title is required';
    }
    if (!form.body) {
      err.body = 'Text is required';
    }
    return err;
  };

  useEffect(() => {
    if (notes.length !== 0) {
      setNotes(notes);
    } else {
      setNotes(initialNotes);
    }
  }, [initialNotes, notes, setNotes]);

  const createNote = async () => {
    try {
      const { userId } = jwtDecode(Cookies.get('token'));
      const response = await axios.post(
        'http://localhost:3000/api/notes',
        { ...form, userId },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      );

      setNotes((prevNotes) => [...prevNotes, response.data]);
      form.body = '';
      form.title = '';
    } catch (error) {
      setErrors({
        body: error.response ? error.response.data.message : error.message,
      });
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Create Note</h1>
      <form className="form-group" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="form-control my-2"
            value={form.title}
            onChange={handleChange}
          />
          <span className={`text-error ${errors.body && 'text-error_visible'}`}>
            {errors.title}
          </span>
        </div>
        <div className="form-group my-2">
          <textarea
            name="body"
            placeholder="Text"
            className="form-control"
            value={form.body}
            onChange={handleChange}
          />
          <span className={`text-error ${errors.body && 'text-error_visible'}`}>
            {errors.body}
          </span>
        </div>
        <div className="form-group">
          <button className=" form-group btn btn-primary my-4" type="submit">
            Create
          </button>
        </div>
      </form>
      {isSubmitting && <Loader />}
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

  const { userId } = jwtDecode(token);
  const res = await axios.get(
    `http://localhost:3000/api/notes?userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const initialNotes = res.data;

  return {
    props: { initialNotes },
  };
}
export default NewNote;
