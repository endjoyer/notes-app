import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { NotesContext } from '../../../context/NotesContext';
import Loader from '../../../components/Loader';

const EditNote = ({ note }) => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const { notes, setNotes } = useContext(NotesContext);

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

  const updateNote = async () => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
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
      {!isSubmitting ? (
        <>
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
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3001/notes/${params.id}`);
  const note = await res.json();

  return { props: { note }, revalidate: 1 };
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3001/notes');
  const notes = await res.json();

  const paths = notes.map((note) => ({
    params: { id: note.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export default EditNote;
