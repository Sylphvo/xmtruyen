import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Books } from './pages/Books';
import { BookDetails } from './pages/BookDetails';
import { Topics } from './pages/Topics';
import { Categories } from './pages/Categories';
import { Login } from './pages/Login';
import { Database } from './pages/Database';
import { DatabaseTableViewer } from './pages/DatabaseTableViewer';
import { BookFiles } from './pages/BookFiles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/database" element={<Database />} />
          <Route path="/database/:tableName" element={<DatabaseTableViewer />} />
          <Route path="/book-files" element={<BookFiles />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
