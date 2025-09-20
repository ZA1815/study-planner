import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;