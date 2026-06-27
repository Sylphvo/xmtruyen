import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<div className="p-4 text-white">Trang Quản lý Sách</div>} />
          <Route path="/topics" element={<div className="p-4 text-white">Trang Quản lý Topic</div>} />
          <Route path="/categories" element={<div className="p-4 text-white">Trang Quản lý Category</div>} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
