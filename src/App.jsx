import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import SpeakerDetail from './pages/SpeakerDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Main Site Routes */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen pattern-bg">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lectures" element={<Lectures />} />
                    <Route path="/lectures/:id" element={<LectureDetail />} />
                    <Route path="/speakers/:id" element={<SpeakerDetail />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
