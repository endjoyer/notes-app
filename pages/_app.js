import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { NotesProvider } from '../context/NotesContext';

export default function App({ Component, pageProps }) {
  return (
    <NotesProvider>
      <Component {...pageProps} />
    </NotesProvider>
  );
}
