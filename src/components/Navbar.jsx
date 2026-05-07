import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              </svg>
              <span className="font-bold text-2xl tracking-tight">Islamic Speakers Hub</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-white hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            <Link to="/lectures" className="text-white hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">Browse Lectures</Link>
            
            {user ? (
              <>
                <Link to="/admin" className="text-white hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="text-white border border-secondary/50 hover:bg-secondary hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              null
              // <Link to="/login" className="text-white border border-secondary/50 hover:bg-secondary hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-all">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-secondary focus:outline-none transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-primary border-t border-white/10 pb-4`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-white hover:bg-white/10 hover:text-secondary px-3 py-4 rounded-md text-base font-medium transition-colors border-b border-white/5">Home</Link>
          <Link to="/lectures" onClick={() => setIsMenuOpen(false)} className="block text-white hover:bg-white/10 hover:text-secondary px-3 py-4 rounded-md text-base font-medium transition-colors border-b border-white/5">Browse Lectures</Link>
          {user ? (
            <>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-white hover:bg-white/10 hover:text-secondary px-3 py-4 rounded-md text-base font-medium transition-colors border-b border-white/5">Admin Dashboard</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left text-white hover:bg-white/10 hover:text-secondary px-3 py-4 rounded-md text-base font-medium transition-colors">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-white hover:bg-white/10 hover:text-secondary px-3 py-4 rounded-md text-base font-medium transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
