import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = ({ children, title, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const displayName = user?.name || JSON.parse(localStorage.getItem('user'))?.name || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    )},
    { id: 'speakers', label: 'Speakers', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    )},
    { id: 'topics', label: 'Topics', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
    )},
    { id: 'lectures', label: 'Lectures', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
    )},
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 md:h-20 flex items-center px-6 border-b border-white/10 flex-shrink-0">
        <span className="font-bold text-lg md:text-xl tracking-tight text-[#D4AF37]">ISH Admin Panel</span>
      </div>
      <nav className="flex-grow py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === item.id
                ? 'bg-white/10 border-l-4 border-[#D4AF37] text-white font-bold'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <Link
          to="/"
          className="block w-full text-center py-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-[#0B4A2B] text-white flex flex-col h-full flex-shrink-0 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 z-10 flex-shrink-0 gap-4">
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-gray-600 hover:text-[#0B4A2B] focus:outline-none flex-shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base md:text-xl font-bold text-gray-800 truncate capitalize">
              {title || 'Dashboard'}
            </h2>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800 leading-tight">{displayName}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm font-medium text-red-600 hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-red-100 whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
