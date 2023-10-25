import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import nextCookies from 'next-cookies';
import { NotesContext } from '../../../context/NotesContext';
import Loader from '../../../components/Loader';

const EditNote = ({ note, initialNotes }) => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const { notes, setNotes } = useContext(NotesContext);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  useEffect(() => {
    setForm(note);
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      await updateNote();
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  // useEffect(() => {
  //   setNotes(notes);
  // }, [notes, setNotes]);

  const updateNote = async () => {
    try {
      await axios.put(`http://localhost:3000/notes/${id}`, form, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? form : note))
      );
      router.push(`/note/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Edit Note</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control  my-2"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <div>{errors.title}</div>}
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            name="body"
            placeholder="Text"
            value={form.body}
            onChange={handleChange}
          />
          {errors.body && <div>{errors.body}</div>}
        </div>
        <div className="form-group my-4">
          <button className="btn btn-primary" type="submit">
            Update
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

  const { id } = context.params;

  const responseNote = await axios.get(`http://localhost:3000/notes/${id}`, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  });
  const note = responseNote.data;

  const responseNotes = await axios.get('http://localhost:3000/notes', {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  });
  const initialNotes = responseNotes.data;

  return {
    props: { note, initialNotes },
  };
}

export default EditNote;
