import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const Login = () => {
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
        const res = await axios.post(`/api/auth/login`, {
          username,
          password,
        });
        Cookies.set('token', res.data.token);
        router.push('/');
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
      <h2 className="my-3">Login</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control my-1"
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
          className="form-control my-1"
        />
        <span
          className={`text-error ${errors.password && 'text-error_visible'}`}
        >
          {errors.password}
        </span>
        <button type="submit" className="btn btn-primary my-2">
          Login
        </button>
      </form>
      <Link href="/register">
        <a>Don&apos;t have an account? Register</a>
      </Link>
    </div>
  );
};

export default Login;
