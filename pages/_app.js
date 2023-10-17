import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { NotesProvider } from '../context/NotesContext';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <NotesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NotesProvider>
  );
}
