import { useState } from 'react';
import { useRouter } from 'next/router';

const NewNote = () => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

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
      err.body = 'Body is required';
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
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Note</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <div>{errors.title}</div>}
          </div>
          <div>
            <textarea
              name="body"
              placeholder="Body"
              value={form.body}
              onChange={handleChange}
            />
            {errors.body && <div>{errors.body}</div>}
          </div>
          <div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNote;
