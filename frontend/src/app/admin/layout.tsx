'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, clearSession } from '../../utils/api';
import { 
  BarChart3, Calendar, Users, IndianRupee, Plus, FileSpreadsheet, 
  CreditCard, Bell, TrendingUp, Settings, LogOut, Menu, X, Shield, ChevronRight, ChevronLeft,
  Zap
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8F9FC] gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#FFD400]/20 rounded-full" />
          <div className="w-12 h-12 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <span className="text-sm font-semibold text-gray-400 tracking-wide">Verifying credentials...</span>
      </div>
    );
  }

  const initials = `${session?.firstName?.charAt(0) || 'A'}${session?.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col md:flex-row w-full">
      
      {/* ── Mobile Top Bar ── */}
      <header className="md:hidden w-full h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-5 sticky top-0 z-40 shadow-[0_1px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFD400] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(255,212,0,0.4)]">
            <Shield size={16} className="text-gray-900" />
          </div>
          <span className="font-black text-gray-900 tracking-tight text-[15px]">AdminConsole<span className="text-[#FFD400]">.</span></span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-gray-900 z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 flex flex-col justify-between md:hidden shadow-2xl"
            >
              {/* Mobile Sidebar Header */}
              <div>
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFD400] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(255,212,0,0.4)]">
                      <Shield size={16} className="text-gray-900" />
                    </div>
                    <span className="font-black text-gray-900 text-[15px]">AdminConsole<span className="text-[#FFD400]">.</span></span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                          active 
                            ? 'bg-[#FFD400] text-gray-900 shadow-[0_2px_8px_rgba(255,212,0,0.35)]' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={17} className={active ? 'text-gray-900' : 'text-gray-400'} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Profile Footer */}
              <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-[#FFD400] flex items-center justify-center font-black text-gray-900 text-sm shadow-[0_2px_6px_rgba(255,212,0,0.35)] shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{session?.firstName} {session?.lastName}</p>
                    <p className="text-xs text-gray-400 font-medium truncate">{session?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-colors"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside 
        className={`hidden md:flex ${isCollapsed ? 'w-[70px]' : 'w-[240px]'} shrink-0 flex-col justify-between sticky top-0 h-screen z-30 transition-all duration-300 ease-out bg-white border-r border-gray-100 shadow-[1px_0_20px_rgba(0,0,0,0.04)]`}
        style={{ position: 'sticky' }}
      >
        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-[#FFD400] hover:border-[#FFD400] text-gray-400 hover:text-gray-900 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center z-40"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className={`px-4 py-5 border-b border-gray-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(255,212,0,0.4)] shrink-0">
                  <Shield size={17} className="text-gray-900" />
                </div>
                <div>
                  <span className="text-[15px] font-black text-gray-900 tracking-tight block leading-none">AdminConsole<span className="text-[#FFD400]">.</span></span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Management</span>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 bg-[#FFD400] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(255,212,0,0.4)]">
                <Shield size={17} className="text-gray-900" />
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-0.5">
            {!isCollapsed && (
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.12em] px-3 py-2 mt-1">Navigation</p>
            )}
            {navItems.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl font-semibold text-[13px] transition-all duration-150 group relative ${
                    active 
                      ? 'bg-[#FFD400] text-gray-900 shadow-[0_2px_12px_rgba(255,212,0,0.35)]' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={17} className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {active && <ChevronRight size={12} className="text-gray-700/60" />}
                    </>
                  )}
                  {/* Tooltip for collapsed */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className={`border-t border-gray-100 p-3 space-y-2`}>
          {/* Profile Card */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5 bg-gradient-to-r from-gray-50 to-yellow-50/30 border border-gray-100'} rounded-xl transition-all`}>
            <div className="w-8 h-8 rounded-xl bg-[#FFD400] flex items-center justify-center font-black text-gray-900 text-xs shadow-[0_2px_8px_rgba(255,212,0,0.4)] shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate leading-tight">{session?.firstName} {session?.lastName}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{session?.email}</p>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center justify-center ${isCollapsed ? 'p-2.5' : 'gap-2 px-3 py-2'} rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold text-xs transition-all duration-150 group`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={14} className="group-hover:rotate-[-8deg] transition-transform duration-150" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 flex flex-col p-5 md:p-8 pb-24 md:pb-8 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
