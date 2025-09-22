import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import ProtectedRoute from './components/ProtectedRoute';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <main className="container mx-auto p-4">
        <Routes>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/calendar' element={<CalendarPage />} />
        </Route>
      </Routes>
      </main>
    </div>
  );
}

export default App;