'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, clearSession } from '../../utils/api';
import { 
  BarChart3, Calendar, Users, IndianRupee, Plus, FileSpreadsheet, 
  CreditCard, Bell, TrendingUp, Settings, LogOut, Menu, X, Shield, ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(newVal));
      return newVal;
    });
  };

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      router.push('/login');
      return;
    }
    if (!activeSession.roles?.includes('ROLE_ADMIN')) {
      router.push('/');
      return;
    }
    setSession(activeSession);
    setLoading(false);
  }, [pathname]);

  const handleSignOut = () => {
    clearSession();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Create Event', href: '/admin/events/create', icon: Plus },
    { name: 'Bookings', href: '/admin/bookings', icon: FileSpreadsheet },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-3">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-gray-500">Checking credentials...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col md:flex-row w-full">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full h-16 bg-white border-b border-gray-200 flex justify-between items-center px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900">A</div>
          <span className="font-extrabold text-gray-900 tracking-tight">AdminConsole</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-gray-200 z-50 flex flex-col justify-between p-6 md:hidden"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-gray-900">A</div>
                    <span className="font-extrabold text-gray-900 tracking-tight">AdminConsole</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                          active 
                            ? 'bg-yellow-400 text-gray-900' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-900">
                    {session?.firstName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{session?.firstName} {session?.lastName}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl text-sm transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Sidebar */}
      <aside className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} shrink-0 bg-white border-r border-gray-200 flex-col justify-between p-5 sticky top-0 h-screen z-30 transition-all duration-200 relative`}>
        {/* Floating Collapse/Expand Trigger Button on Right Border */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center z-40 focus:outline-none"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className="space-y-8 overflow-y-auto pr-1">
          <div className="flex items-center px-1">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center transform hover:rotate-6 transition-all duration-300">
                  <Shield size={18} className="text-gray-900" />
                </div>
                <span className="text-lg font-black text-gray-900 tracking-tight">AdminConsole<span className="text-yellow-400">.</span></span>
              </div>
            ) : (
              <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto transform hover:rotate-6 transition-all duration-300">
                <Shield size={18} className="text-gray-900" />
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'justify-between px-4 py-3'} rounded-xl font-bold text-sm transition-all group ${
                    active 
                      ? 'bg-yellow-400 text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && active && <ChevronRight size={14} className="text-gray-900" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-5 space-y-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-1'}`}>
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-900 shrink-0">
              {session?.firstName?.charAt(0) || 'A'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{session?.firstName} {session?.lastName}</p>
                <p className="text-xs text-gray-400 font-medium truncate">{session?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center justify-center ${isCollapsed ? 'p-3' : 'gap-2 px-4 py-3'} border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 font-bold rounded-xl text-sm transition-all duration-200`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Admin Pages Render Window */}
      <main className="flex-1 min-w-0 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
