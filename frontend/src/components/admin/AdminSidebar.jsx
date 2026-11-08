import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Gamepad2,
  Ticket,
  CreditCard,
  Users,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const AdminSidebar = () => {
  const links = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Events', path: '/admin/events', icon: CalendarDays },
    { name: 'Manage Games', path: '/admin/games', icon: Gamepad2 },
    { name: 'Registrations', path: '/admin/registrations', icon: Ticket },
    { name: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { name: 'User Accounts', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-navy-950 border-r border-cobalt-500/20 flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="px-2 pt-2">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cobalt-600 to-electric-cyan flex items-center justify-center shadow-glow-cobalt">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-black font-display text-white uppercase tracking-wider block">
                COBALT<span className="text-electric-cyan">SKIES</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block -mt-1">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cobalt-600/30 text-white border border-cobalt-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-cobalt-400" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Return to website */}
      <div className="pt-4 border-t border-cobalt-500/20">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Fest Site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
