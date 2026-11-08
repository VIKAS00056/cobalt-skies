import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Menu,
  X,
  User,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Ticket,
  ChevronDown,
  Gamepad2,
  Calendar,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Events', path: '/events' },
    { name: 'Games', path: '/games' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-900/90 backdrop-blur-md border-b border-cobalt-500/20 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cobalt-700 via-cobalt-500 to-electric-cyan flex items-center justify-center shadow-glow-cobalt group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider font-display text-white uppercase flex items-center">
                COBALT<span className="text-electric-cyan ml-1.5 font-light">SKIES</span>
              </span>
              <span className="block text-[10px] tracking-widest text-cobalt-400 font-mono -mt-1 uppercase">
                National Fest 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith('/#');
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-cobalt-950/40"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-cobalt-600/30 border border-cobalt-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-cobalt-950/40'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-navy-850 border border-cobalt-500/30 text-slate-200 hover:border-cobalt-400 transition-all hover:shadow-glow-cobalt"
                >
                  <div className="w-7 h-7 rounded-lg bg-cobalt-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-navy-850 border border-cobalt-500/30 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-cobalt-500/20 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cobalt-950 text-electric-cyan border border-cobalt-600/30">
                        {user?.role === 'admin' ? 'Fest Administrator' : 'Participant'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-cobalt-900/40 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cobalt-400" />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=events"
                      className="flex items-center space-x-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-cobalt-900/40 rounded-xl transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-electric-cyan" />
                      <span>My Registrations</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 rounded-xl transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-cobalt-500/20 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cobalt-600 to-cobalt-700 hover:from-cobalt-500 hover:to-cobalt-600 rounded-xl shadow-glow-cobalt hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-navy-850 border border-cobalt-500/30 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900/95 border-b border-cobalt-500/30 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isHash = link.path.startsWith('/#');
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    className="px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-cobalt-950/50 rounded-xl"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-base font-medium rounded-xl ${
                      isActive ? 'bg-cobalt-600/30 text-white font-semibold' : 'text-slate-200'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-cobalt-500/20">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-navy-850 rounded-xl border border-cobalt-500/20 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cobalt-600 flex items-center justify-center font-bold text-white uppercase text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-cobalt-950/50 rounded-xl"
                >
                  <LayoutDashboard className="w-5 h-5 text-cobalt-400" />
                  <span>My Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-4 py-2.5 text-amber-300 hover:bg-amber-950/50 rounded-xl"
                  >
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-rose-400 hover:bg-rose-950/50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-cobalt-500/40 text-slate-200 font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-xl bg-cobalt-600 text-white font-semibold shadow-glow-cobalt"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
