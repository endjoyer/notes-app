import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NotePage = () => {
  const [note, setNote] = useState();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    const res = await fetch(`/api/notes/${id}`);
    const { data } = await res.json();
    console.log(data);
    setNote(data);
  };
  console.log(id);

  return (
    <div className="container">
      {note ? (
        <>
          <h1 className="my-4">{note.title}</h1> <p>{note.body}</p>
          <Link legacyBehavior href={`${id}/edit`}>
            <a className="btn btn-primary">Edit</a>
          </Link>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default NotePage;
