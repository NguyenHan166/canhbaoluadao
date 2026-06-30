/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Globe
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login input state (accepts either email or phone)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  if (!isOpen) return null;

  // Helper: Retrieve users from localStorage
  const getStoredUsers = (): User[] => {
    const usersStr = localStorage.getItem('lcs_registered_users');
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  };

  // Helper: Store a user
  const storeUser = (newUser: User & { password?: string }) => {
    const users = getStoredUsers();
    // Prevent duplicate email/phone
    const filtered = users.filter(u => u.email !== newUser.email && u.phone !== newUser.phone);
    localStorage.setItem('lcs_registered_users', JSON.stringify([...filtered, newUser]));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/[\s.-]/g, ''))) {
      setError('Số điện thoại phải bao gồm 10-11 ký tự số.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu đăng ký phải từ 6 ký tự trở lên.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      const existingEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      const existingPhone = users.find(u => u.phone === phone);

      if (existingEmail) {
        setError('Địa chỉ email này đã được đăng ký trên hệ thống.');
        setIsLoading(false);
        return;
      }

      if (existingPhone) {
        setError('Số điện thoại này đã được sử dụng trên hệ thống.');
        setIsLoading(false);
        return;
      }

      const uid = 'usr_' + Math.random().toString(36).substr(2, 9);
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1e3a8a,0d9488,b91c1c`;
      
      const newUser = {
        uid,
        name,
        email,
        phone,
        avatarUrl,
        password // Stored securely in mock localStorage
      };

      storeUser(newUser);
      setIsLoading(false);
      setSuccess('Đăng ký tài khoản Lá Chắn Số thành công! Đang tự động đăng nhập...');
      
      setTimeout(() => {
        const { password, ...safeUser } = newUser;
        onAuthSuccess(safeUser);
        onClose();
        // Reset state
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      }, 1500);

    }, 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Vui lòng điền đầy đủ Email/SĐT và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: loginIdentifier.trim(),
        password: loginPassword
      });

      if (response.success && response.accessToken) {
        localStorage.setItem('lcs_user_token', response.accessToken);
        localStorage.setItem('lcs_user_refresh_token', response.refreshToken);
        
        const loggedInUser: User = {
          uid: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: '',
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(response.user.name)}`,
        };
        
        setIsLoading(false);
        setSuccess('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
        setTimeout(() => {
          onAuthSuccess(loggedInUser);
          onClose();
          setLoginIdentifier('');
          setLoginPassword('');
        }, 1000);
        return;
      }
    } catch (err: any) {
      console.warn('Backend login failed, trying local fallback:', err.message);
    }

    setTimeout(() => {
      const users = getStoredUsers();
      const matchedUser = users.find(
        u => (u.email.toLowerCase() === loginIdentifier.trim().toLowerCase() || u.phone === loginIdentifier.trim()) &&
             (u as any).password === loginPassword
      );

      setIsLoading(false);

      if (!matchedUser) {
        setError('Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại.');
        return;
      }

      setSuccess('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
      setTimeout(() => {
        const { password, ...safeUser } = matchedUser as any;
        onAuthSuccess(safeUser);
        onClose();
        setLoginIdentifier('');
        setLoginPassword('');
      }, 1000);
    }, 400);
  };

  // Google Simulated Sign-In Options
  const triggerGoogleLogin = () => {
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = (googleName: string, googleEmail: string, googleAvatar: string) => {
    setIsLoading(true);
    setShowGoogleChooser(false);

    setTimeout(() => {
      const uid = googleEmail === 'nvhan166@gmail.com' ? 'goog_han' : 'goog_' + Math.random().toString(36).substr(2, 9);
      const googleUser: User = {
        uid,
        name: googleName,
        email: googleEmail,
        avatarUrl: googleAvatar,
        phone: '098******1', // Linked placeholder for Google users
        isGoogleUser: true
      };

      // Store in register list as well
      storeUser(googleUser);
      setIsLoading(false);
      setSuccess(`Kết nối tài khoản Google ${googleEmail} thành công!`);

      setTimeout(() => {
        onAuthSuccess(googleUser);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in font-sans">
      
      {/* GOOGLE ACCOUNT CHOOSER DIALOG OVERLAY */}
      {showGoogleChooser ? (
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 animate-scale-up z-[110] p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              {/* Colored stylized Google text logo */}
              <span className="font-serif font-bold text-lg tracking-tight">
                <span className="text-blue-600">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-600">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
              <span className="text-slate-400 font-semibold text-xs">Sign In</span>
            </div>
            <button 
              onClick={() => setShowGoogleChooser(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-800">Chọn một tài khoản</h3>
            <p className="text-xs text-slate-500">để tiếp tục đăng nhập vào <span className="font-bold text-blue-900">Lá Chắn Số</span></p>
          </div>

          {/* Accounts List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            <button
              onClick={() => handleSelectGoogleAccount('Nguyễn Văn Hân', 'nvhan166@gmail.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition"
            >
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-slate-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Nguyễn Văn Hân</p>
                <p className="text-[11px] text-slate-500 truncate">nvhan166@gmail.com</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm">Mặc định</span>
            </button>

            <button
              onClick={() => handleSelectGoogleAccount('Lê Minh Tâm', 'minhtam.le@gmail.com', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition"
            >
              <img 
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80" 
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-slate-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Lê Minh Tâm</p>
                <p className="text-[11px] text-slate-500 truncate">minhtam.le@gmail.com</p>
              </div>
            </button>

            <button
              onClick={() => {
                const mail = prompt('Nhập địa chỉ Email Google của bạn:');
                if (mail) {
                  const parts = mail.split('@');
                  const nameStr = parts[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  handleSelectGoogleAccount(nameStr || 'Người dùng Google', mail, `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mail)}`);
                }
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-slate-50 text-left transition text-xs font-semibold text-slate-600"
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <span>Sử dụng tài khoản Google khác...</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Để an toàn, Google chỉ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ của bạn với Lá Chắn Số.
          </p>
        </div>
      ) : (
        /* STANDARD LOGIN / REGISTER CARD */
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-scale-up flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold tracking-tight">CỔNG BẢO MẬT LÁ CHẮN SỐ</h3>
                <p className="text-[10px] text-blue-100">Đăng nhập để tương tác, gửi bình luận và phản ánh tin tức</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              id="btn-close-auth-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 text-center py-3 text-xs font-bold border-b-2 transition ${activeTab === 'login' ? 'border-blue-900 text-blue-900 font-extrabold bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              ĐĂNG NHẬP THÀNH VIÊN
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
              className={`flex-1 text-center py-3 text-xs font-bold border-b-2 transition ${activeTab === 'register' ? 'border-blue-900 text-blue-900 font-extrabold bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              ĐĂNG KÝ TÀI KHOẢN MỚI
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            
            {/* Feedback Alerts */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* TAB CONTENT: LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email hoặc Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Nhập email hoặc số điện thoại đã đăng ký"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    />
                    <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Mật khẩu truy cập <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mật khẩu của bạn"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    />
                    <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
                >
                  {isLoading ? 'Đang xác thực thông tin...' : 'Đăng nhập ngay'}
                </button>
              </form>
            ) : (
              /* TAB CONTENT: REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Họ và tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn Hân"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    />
                    <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="ten@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                      <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: 0912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                      <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Mật khẩu đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Từ 6 ký tự"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                      <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Gõ lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                      <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
                >
                  {isLoading ? 'Đang xử lý tạo tài khoản...' : 'Đăng ký tài khoản Lá Chắn Số'}
                </button>
              </form>
            )}

            {/* OR separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-extrabold uppercase">
                <span className="bg-white px-3 text-slate-400">HOẶC TIẾP CẬN BẰNG</span>
              </div>
            </div>

            {/* Google Sign-in action */}
            <button
              type="button"
              onClick={triggerGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg text-xs transition"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Đăng nhập nhanh bằng tài khoản Google</span>
            </button>

          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 leading-relaxed">
            <span>Bảo mật 256-bit SSL</span>
            <span>© 2026 Lá Chắn Số Việt Nam</span>
          </div>

        </div>
      )}

    </div>
  );
}
