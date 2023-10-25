import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        await axios.post('http://localhost:3000/api/auth/register', {
          username,
          password,
        });
        router.push('/login');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const validate = () => {
    let err = {};
    if (!username) {
      err.username = 'Username is required';
    }
    if (!password) {
      err.password = 'Password is required';
    }
    return err;
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control my-2"
        />
        <span
          className={`text-error ${errors.username && 'text-error_visible'}`}
        >
          {errors.username}
        </span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control my-2"
        />
        <span
          className={`text-error ${errors.password && 'text-error_visible'}`}
        >
          {errors.password}
        </span>
        <button type="submit" className="btn btn-primary my-2">
          Register
        </button>
      </form>
      <Link href="/login">
        <a>Already have an account? Login</a>
      </Link>
    </div>
  );
};

export default Register;
