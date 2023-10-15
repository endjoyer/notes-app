import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditNote = () => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    const res = await fetch(`/api/notes/${id}`);
    const { data } = await res.json();
    setForm(data);
  };

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
      err.body = 'Body is required';
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
      router.push(`/note/${id}`);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(form);
  return (
    <div className="container">
      <h1 className="my-4">Edit Note</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
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
              placeholder="Body"
              value={form.body}
              onChange={handleChange}
            />
            {errors.body && <div>{errors.body}</div>}
          </div>
          <div className="form-group">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
