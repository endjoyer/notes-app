import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { NotesContext } from '../context/NotesContext';

const NewNote = () => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
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

  const createNote = async () => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const newNote = await res.json();
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      router.push('/');
    } catch (error) {
      console.error(error);
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
          {errors.title && <div>{errors.title}</div>}
        </div>
        <div className="form-group">
          <textarea
            name="body"
            placeholder="Text"
            className="form-control"
            value={form.body}
            onChange={handleChange}
          />
          {errors.body && <div>{errors.body}</div>}
        </div>
        <div className="form-group">
          <button className=" form-group btn btn-primary my-4" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewNote;
