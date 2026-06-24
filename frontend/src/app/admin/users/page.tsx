'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Search, Shield, ShieldAlert, Ban, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, b] = await Promise.all([
        api.get('/auth/users'),
        api.get('/bookings')
      ]);
      setUsers(u);
      setBookings(b);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (user: any) => {
    try {
      await api.put(`/auth/users/${user.id}/block?blocked=${!user.blocked}`);
      loadData();
    } catch (e) {
      alert('Error updating user block status');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      loadData();
    } catch (e) {
      alert('Error deleting user');
    }
  };

  const openHistoryModal = (user: any) => {
    setSelectedUser(user);
    const filtered = bookings.filter(b => b.userEmail === user.email);
    setUserBookings(filtered);
    setShowHistoryModal(true);
  };

  const filteredUsers = users.filter(u => {
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-black text-gray-900 leading-none">Users</div>
          <p className="text-sm text-gray-500 font-semibold mt-1">Manage user profiles, accounts status, and registration logs</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search users by name or email address..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50 text-gray-400 font-semibold"><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Role</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-yellow-50/40 transition-colors duration-150">
                  <td className="p-4 font-bold text-gray-950">{u.firstName} {u.lastName}</td>
                  <td className="p-4 font-medium text-gray-500">{u.email}</td>
                  <td className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {u.roles?.join(', ') || 'USER'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.blocked 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      {u.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end items-center gap-2">
                    <button 
                      onClick={() => openHistoryModal(u)} 
                      className="bg-white border border-gray-200 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-1 shadow-xs"
                    >
                      <Info size={12} /> History
                    </button>
                    <button 
                      onClick={() => toggleBlockUser(u)} 
                      className={`p-2 rounded-lg border transition-all ${
                        u.blocked 
                          ? 'border-green-100 hover:bg-green-50 text-green-600' 
                          : 'border-red-100 hover:bg-red-50 text-red-500'
                      }`}
                    >
                      {u.blocked ? <Shield size={14} /> : <ShieldAlert size={14} />}
                    </button>
                    <button 
                      onClick={() => deleteUser(u.id)} 
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Ban size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No users match query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User History Modal */}
      <AnimatePresence>
        {showHistoryModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-xl font-black text-gray-900">User Ticket Reservations</div>
                  <p className="text-xs font-bold text-gray-400 mt-1">{selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-900 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {userBookings.map(b => (
                  <div key={b.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50/20">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Quantity: <span className="font-bold text-gray-700">{b.quantity}</span> · Date: {new Date(b.bookingDate || b.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        b.status === 'CONFIRMED' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>{b.status}</span>
                      <p className="font-black text-gray-950 text-sm mt-1">₹{b.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}

                {userBookings.length === 0 && (
                  <p className="text-center text-gray-400 py-12 font-medium">This user hasn't booked any events yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
