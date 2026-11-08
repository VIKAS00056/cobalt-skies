import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  GraduationCap,
  Mail,
  Phone,
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const { showToast } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search, role: roleFilter });
      if (res.success) setUsers(res.data);
    } catch (err) {
      showToast('Failed to load user list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const handleToggleBlock = async (user) => {
    if (user.role === 'admin') {
      showToast('Cannot suspend administrator accounts', 'warning');
      return;
    }

    const action = user.isBlocked ? 'reactivate' : 'suspend';
    if (window.confirm(`Are you sure you want to ${action} account for ${user.name}?`)) {
      try {
        await adminService.toggleBlockUser(user._id);
        showToast(`User account has been ${user.isBlocked ? 'reactivated' : 'suspended'}`, 'info');
        fetchUsers();
      } catch (err) {
        showToast(err.message || 'Operation failed', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-display">User Accounts Management</h1>
          <p className="text-xs text-slate-400">
            Inspect registered delegates, colleges, contact details, and account access permissions.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-navy-850 border border-cobalt-500/20 text-xs font-mono text-slate-300">
          Total Registered: <span className="font-bold text-electric-cyan">{users.length}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or college..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-electric-cyan"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-navy-900 border border-cobalt-500/25 text-slate-300 text-xs focus:outline-none focus:border-electric-cyan"
        >
          <option value="All">All Roles</option>
          <option value="user">Participants (Delegates)</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-navy-850 border border-cobalt-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900 border-b border-cobalt-500/20 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">College & USN</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt-500/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500 font-mono">
                    Loading accounts...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3.5 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cobalt-600 flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-300">
                      {u.phone}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-slate-200 block font-medium truncate max-w-[200px]">{u.college}</span>
                      {u.usn && <span className="text-[10px] font-mono text-slate-400">{u.usn}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : 'bg-navy-900 text-cobalt-300 border border-cobalt-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.isBlocked
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {u.isBlocked ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[10px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                            u.isBlocked
                              ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {u.isBlocked ? 'Reactivate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500 font-sans">
                    No users found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
