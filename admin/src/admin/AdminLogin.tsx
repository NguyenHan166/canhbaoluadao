import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginProps {
  onLoginSuccess: (email: string, rememberMe: boolean) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('lcs_admin_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('lcs_admin_remember_me') !== 'false';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.success && response.accessToken) {
        if (rememberMe) {
          localStorage.setItem('lcs_admin_remembered_email', email);
          localStorage.setItem('lcs_admin_remember_me', 'true');
        } else {
          localStorage.removeItem('lcs_admin_remembered_email');
          localStorage.setItem('lcs_admin_remember_me', 'false');
        }
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('lcs_admin_token', response.accessToken);
        storage.setItem('lcs_admin_refresh_token', response.refreshToken);
        onLoginSuccess(response.user.email, rememberMe);
      } else {
        setError(response.message || 'Xác thực hệ thống không thành công.');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      {/* Futuristic glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-950 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-950/50">
            <Shield className="h-9 w-9 text-blue-400 animate-pulse" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          LÁ CHẮN SỐ
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 uppercase tracking-widest font-mono">
          Cổng Quản Trị Hệ Thống An Toàn Số
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950/80 backdrop-blur-md py-8 px-4 border border-slate-800/80 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-950/40 border border-rose-800/50 p-4 rounded-xl flex items-start gap-3 text-xs text-rose-200">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Đăng nhập thất bại:</span> {error}
                  <div className="mt-1.5 text-[10px] text-rose-300/80 bg-rose-950/60 p-1.5 rounded border border-rose-900/30 font-mono">
                    TK: nvhan166@gmail.com / MK: nvhan1662003
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Quản trị viên
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="admin@lanchanso.gov.vn"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-800 rounded-xl bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-800 rounded bg-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                  Ghi nhớ phiên làm việc
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-semibold text-blue-400 hover:text-blue-300">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xác thực hệ thống...</span>
                  </div>
                ) : (
                  'ĐĂNG NHẬP VÀO CMS'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Hệ thống an ninh mạng kiểm soát truy cập.<br />
              Mọi hoạt động trái phép sẽ bị ghi lại và xử lý theo Luật An ninh mạng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
