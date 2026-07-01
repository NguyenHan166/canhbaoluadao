/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Menu, 
  X, 
  AlertTriangle, 
  BellRing, 
  FileText, 
  CheckSquare, 
  Type, 
  Calendar,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { Category } from '../types';
import type { User } from '../types';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string, categoryFilter?: Category | '') => void;
  selectedCategory: Category | '';
  onSearch: (query: string) => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  categories?: any[];
}

export default function Navbar({
  currentPage,
  onPageChange,
  selectedCategory,
  onSearch,
  currentUser,
  onOpenLogin,
  onLogout,
  categories = []
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const formattedDate = `${days[now.getDay()]}, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
    setCurrentDateString(formattedDate);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (currentPage !== 'home') {
      onPageChange('home');
    }
  };

  const defaultCategories = [
    { name: 'Cảnh báo lừa đảo', slug: 'canh-bao-lua-dao' },
    { name: 'An ninh mạng', slug: 'an-ninh-mang' },
    { name: 'Kiến thức số', slug: 'kien-thuc' },
    { name: 'Kỹ năng & Mẹo', slug: 'meo-huu-ich' }
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  const navItems = [
    { label: 'Trang chủ', page: 'home', category: '' },
    ...displayCategories.filter(c => c.isVisible !== false).map(c => ({
      label: c.name,
      page: 'home',
      category: c.slug
    })),
    { label: 'Báo cáo nghi vấn', page: 'report', category: '' },
    { label: 'Cộng đồng', page: 'dashboard', category: '' },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      {/* 1. TOP UTILITY BAR - Hidden on Mobile/Tablet to save vertical space */}
      <div className="w-full bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] py-1.5 px-4 font-sans hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-700" />
            <span>{currentDateString}</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-blue-700 font-semibold uppercase tracking-wider">Nguồn tin chính thống</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => onPageChange('report')}
                className="text-red-600 font-bold hover:text-red-700 hover:underline uppercase tracking-wider transition flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Báo cáo lừa đảo
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 uppercase tracking-wider">Cộng đồng</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER - Compact horizontal row on all screen sizes */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3.5 flex flex-row justify-between items-center gap-3">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer flex-shrink-0" onClick={() => onPageChange('home', '')}>
          <div className="bg-blue-900 p-2 md:p-2.5 rounded-lg text-white flex-shrink-0">
            <ShieldAlert className="w-5.5 h-5.5 md:w-7 md:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg md:text-2xl font-black text-blue-900 leading-none tracking-tight">
                LÁ CHẮN SỐ
              </h1>
              <span className="bg-red-100 text-red-700 text-[8px] md:text-[9px] font-bold px-1 md:px-1.5 py-0.5 rounded uppercase tracking-wider">
                Dân Sự
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
              Tin tức an toàn số & Bảo vệ cộng đồng
            </p>
          </div>
        </div>

        {/* Search & Actions Container */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Search Input - Hidden on mobile/tablet, shown on desktop (md) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-44 lg:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm tin tức, thủ đoạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full text-xs focus:outline-none focus:border-blue-400 transition bg-slate-50"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </form>

          {/* Quick Submit Button */}
          <button
            onClick={() => onPageChange('report')}
            className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white px-3.5 md:px-5 py-2 md:py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-100 items-center gap-1.5 flex-shrink-0 cursor-pointer"
            id="btn-nav-report"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden md:inline">Báo cáo lừa đảo</span>
            <span className="md:hidden">Báo cáo</span>
          </button>

          {/* User Auth dropdown widget */}
          {currentUser ? (
            <div className="relative shrink-0" id="user-dropdown-container">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 hover:bg-slate-50 p-1 md:p-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                <img 
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                  alt="Avatar" 
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-blue-200 object-cover"
                />
                <div className="hidden lg:block text-left max-w-[110px]">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-slate-400 font-semibold truncate">{currentUser.email}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-scale-up">
                  <div className="px-3.5 py-2 border-b border-slate-100 text-slate-700">
                    <p className="text-xs font-bold truncate text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser.email}</p>
                    {currentUser.phone && (
                      <p className="text-[9px] text-blue-700 font-bold mt-0.5">SĐT: {currentUser.phone}</p>
                    )}
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onPageChange('account');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 rounded-lg font-medium transition cursor-pointer"
                    >
                      Hồ sơ cá nhân
                    </button>
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition cursor-pointer"
                    >
                      Đăng xuất tài khoản
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="border border-blue-950 text-blue-900 hover:bg-blue-50 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-md text-[11px] md:text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 flex-shrink-0 cursor-pointer"
              id="btn-nav-login"
            >
              <UserIcon className="w-3.5 h-3.5 text-blue-900" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex-shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. DESKTOP MAIN NAVIGATION */}
      <nav className="hidden md:block bg-blue-900 h-11">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <ul className="flex items-center gap-2 text-[13px] font-bold text-white">
            {navItems.map((item, idx) => {
              const isActive = 
                (currentPage === item.page && item.category === '' && selectedCategory === '') ||
                (currentPage === item.page && item.category !== '' && selectedCategory === item.category);

              return (
                <li key={idx}>
                  <button
                    onClick={() => {
                      onPageChange(item.page, item.category);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded transition ${
                      isActive 
                        ? 'bg-blue-800 text-white font-extrabold' 
                        : 'text-white hover:text-blue-300'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search Input */}
            <div className="pt-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức, thủ đoạn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 transition"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>
            </div>

            {/* Mobile User Profile Section */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              {currentUser ? (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onPageChange('account');
                  }}
                  className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer hover:opacity-80 transition"
                >
                  <img 
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full object-cover border border-blue-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate hover:underline">Hồ sơ cá nhân &rarr;</p>
                  </div>
                </button>
              ) : (
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Chào mừng đến với Lá Chắn Số</p>
                  <p className="text-[10px] text-slate-400">Đăng nhập đóng góp thông tin</p>
                </div>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition cursor-pointer shrink-0"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="bg-blue-900 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition cursor-pointer shrink-0"
                >
                  Đăng nhập
                </button>
              )}
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-0.5">
              {navItems.map((item, idx) => {
                const isActive = 
                  (currentPage === item.page && item.category === '' && selectedCategory === '') ||
                  (currentPage === item.page && item.category !== '' && selectedCategory === item.category);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onPageChange(item.page, item.category);
                      setIsMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition ${
                      isActive 
                        ? 'bg-blue-50 text-blue-900 font-bold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center px-3.5 text-[10px] text-slate-400">
                <span>Cơ quan bảo trợ:</span>
                <span className="font-semibold text-slate-700">Cổng An toàn Việt Nam</span>
              </div>
              <button
                onClick={() => {
                  onPageChange('report');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-center font-bold py-2 rounded text-xs uppercase tracking-wider transition"
              >
                Gửi Phản Ánh Nghi Vấn
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
