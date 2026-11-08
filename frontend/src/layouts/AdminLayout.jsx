import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Bell } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#050B18] text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Admin Top Header */}
        <header className="h-16 bg-navy-900/80 border-b border-cobalt-500/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Privileged Administrator Mode</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs font-bold text-white block">{user?.name}</span>
              <span className="text-[10px] text-slate-400 block font-mono">Lead Administrator</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl bg-navy-850 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Admin Main Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
