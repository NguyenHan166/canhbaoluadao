import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { api } from './services/api';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Eye, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ThumbsUp, 
  Search,
  ExternalLink,
  Info,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickChecker from './components/QuickChecker';
import ReportForm from './components/ReportForm';
import CommunityDashboard from './components/CommunityDashboard';
import ArticleDetail from './components/ArticleDetail';
import KnowledgePortal from './components/KnowledgePortal';
import MyAccount from './components/MyAccount';

import { ARTICLES, MOCK_REPORTS } from './data/articles';
import { Article, Category, ScamReport } from './types';
import type { User } from './types';
import AuthModal from './components/AuthModal';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  // Navigation & Filtering state read from Router
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const isArticlePage = location.pathname.startsWith('/article/');
  const isCategoryPage = location.pathname.startsWith('/category/');
  const isReportPage = location.pathname.startsWith('/report');
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAccountPage = location.pathname.startsWith('/account');

  // Infer legacy navigation states for subcomponents/highlights
  const currentPage = isArticlePage ? 'article' :
                      isReportPage ? 'report' :
                      isDashboardPage ? 'dashboard' :
                      isAccountPage ? 'account' : 'home';

  // Extract category or article slug from URL path
  const selectedCategory = isCategoryPage ? (location.pathname.split('/category/')[1] as Category) : '';
  const selectedArticleSlug = isArticlePage ? location.pathname.split('/article/')[1] : null;
  
  // Dynamic synchronized articles state (loaded from backend API)
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Custom interactive data state synchronized with localStorage
  const [reports, setReports] = useState<ScamReport[]>(() => {
    const saved = localStorage.getItem('lanchanso_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    localStorage.setItem('lanchanso_reports', JSON.stringify(MOCK_REPORTS));
    return MOCK_REPORTS;
  });

  // User Authentication state (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lcs_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchPublicArticles = async () => {
    try {
      setIsLoading(true);
      const levelMap: Record<string, string> = {
        normal: 'low',
        notice: 'medium',
        warning: 'high',
        urgent: 'critical',
        verified: 'critical'
      };
      const res = await api.get('/api/public/articles');
      if (res.success) {
        const mapped = res.data.map((art: any) => ({
          id: art.id,
          title: art.title,
          slug: art.slug,
          summary: art.summary,
          content: art.content,
          category: art.category?.slug || 'canh-bao-lua-dao',
          categoryLabel: art.category?.name || 'Cảnh báo lừa đảo',
          thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
          author: art.author?.name || 'Admin',
          date: new Date(art.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
          readTime: '3 phút đọc',
          views: art.views || 0,
          isHero: art.isFeatured || false,
          isSubHero: false,
          warningLevel: levelMap[art.warningLevel] || 'low',
          sourceName: art.source?.name || 'Ban biên tập',
          sourceUrl: art.sourceUrl || ''
        }));
        setArticles(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch public articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicArticles();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('lcs_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lcs_current_user');
  };

  // Handle new citizen report submission calling API
  const handleAddReport = async (newReportData: Omit<ScamReport, 'id' | 'createdAt' | 'status' | 'likesCount' | 'commentsCount'>) => {
    try {
      const suspectPhone = newReportData.platform === 'sms' || newReportData.platform === 'call' ? newReportData.targetInfo : undefined;
      const suspectUrl = newReportData.platform === 'website' ? newReportData.targetInfo : undefined;
      const suspectAccount = newReportData.platform === 'facebook' || newReportData.platform === 'zalo' || newReportData.platform === 'tmdt' || newReportData.platform === 'other' ? newReportData.targetInfo : undefined;

      const payload = {
        reporterName: newReportData.reporterName || 'Cư dân ẩn danh',
        contact: newReportData.reporterContact || 'Không có',
        caseType: newReportData.scamType,
        platform: newReportData.platform,
        suspectPhone,
        suspectUrl,
        suspectAccount,
        description: newReportData.description,
        location: newReportData.location || 'Toàn quốc',
        attachments: newReportData.screenshotUrl ? [newReportData.screenshotUrl] : []
      };

      const response = await api.post('/api/public/reports', payload);
      if (response.success) {
        alert('Gửi báo cáo lừa đảo thành công! Đội ngũ kỹ thuật sẽ thẩm định hồ sơ.');
        const randomTicket = 'LCS-' + Math.floor(100000 + Math.random() * 900000);
        const freshReport: ScamReport = {
          ...newReportData,
          id: response.data?.id || `rep-${Date.now()}`,
          userId: currentUser?.uid,
          ticketId: response.data?.ticketId || randomTicket,
          statusMessage: 'Hệ thống đã tiếp nhận phản ánh và đang thẩm định hồ sơ.',
          createdAt: 'Vừa xong - Ngày hôm nay',
          status: 'pending',
          likesCount: 0,
          commentsCount: 0
        };
        setReports([freshReport, ...reports]);
      } else {
        alert(response.message || 'Lỗi gửi phản ánh.');
      }
    } catch (err: any) {
      alert(`Lỗi kết nối máy chủ: ${err.message}`);
    }
  };

  const handlePageChange = (page: string, categoryFilter?: Category | '') => {
    if (page === 'home') {
      if (categoryFilter) {
        navigate(`/category/${categoryFilter}`);
      } else {
        navigate('/');
      }
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  // Filter articles based on category or search query
  const getFilteredArticles = () => {
    let result = articles;
    
    if (selectedCategory) {
      result = result.filter(art => art.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(art => 
        art.title.toLowerCase().includes(q) || 
        art.summary.toLowerCase().includes(q) ||
        (art.quickSummaryPoints && art.quickSummaryPoints.some(p => p.toLowerCase().includes(q)))
      );
    }
    
    return result;
  };

  const filteredArticles = getFilteredArticles();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold font-sans">
        <div className="flex flex-col items-center gap-2.5">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="text-xs uppercase tracking-wider">Đang tải thông tin Lá Chắn Số...</span>
        </div>
      </div>
    );
  }

  // Find featured articles for home page
  const heroArticle = articles.find(art => art.isHero) || articles[0];
  const subHeroArticles = heroArticle ? articles.filter(art => art.isSubHero && art.id !== heroArticle.id).slice(0, 2) : [];
  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);
  const warningArticles = articles.filter(art => art.category === 'canh-bao-lua-dao').slice(0, 4);

  // Find active reading article
  const currentArticle = articles.find(art => art.slug === selectedArticleSlug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300 text-sm">
      
      {/* NAVIGATION BAR */}
      <Navbar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-grow">
        
        {/* ARTICLE DETAIL ROUTE */}
        {selectedArticleSlug && currentArticle ? (
          <ArticleDetail 
            article={currentArticle}
            relatedArticles={articles.filter(art => art.category === currentArticle.category && art.id !== currentArticle.id).slice(0, 2)}
            onBack={() => {
              navigate(-1);
            }}
            onNavigateToArticle={(slug) => {
              navigate(`/article/${slug}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReportSimilar={() => {
              navigate('/report');
            }}
            currentUser={currentUser}
            onOpenLogin={() => setIsAuthModalOpen(true)}
          />
        ) : currentPage === 'report' ? (
          /* SCAM REPORTING FORM ROUTE */
          <ReportForm 
            reports={reports}
            onSubmitReport={handleAddReport}
            currentUser={currentUser}
            onOpenLogin={() => setIsAuthModalOpen(true)}
          />
        ) : currentPage === 'dashboard' ? (
          /* STATISTICAL DASHBOARD ROUTE */
          <CommunityDashboard />
        ) : currentPage === 'account' ? (
          /* MY ACCOUNT VIEW ROUTE */
          <MyAccount 
            currentUser={currentUser}
            reports={reports}
            onBackToHome={() => navigate('/')}
            onNavigateToReport={() => navigate('/report')}
            onOpenLogin={() => setIsAuthModalOpen(true)}
          />
        ) : (
          /* MAIN HOME & ARCHIVE ROUTE */
          <div className="space-y-8">
            
            {/* If user searched or is in a category archive, show breadcrumb & header */}
            {(selectedCategory || searchQuery) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100/50 shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-700">
                    {selectedCategory ? articles.find(a => a.category === selectedCategory)?.categoryLabel : 'Tìm kiếm'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  {selectedCategory 
                    ? `Chuyên mục: ${articles.find(a => a.category === selectedCategory)?.categoryLabel}`
                    : `Kết quả tìm kiếm cho: "${searchQuery}"`}
                </h2>
                <p className="text-xs text-slate-500">
                  Phát hiện <strong className="text-blue-700">{filteredArticles.length}</strong> bài viết và cảnh báo tương thích.
                </p>
                
                {filteredArticles.length === 0 && (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-sm font-semibold text-slate-500">Chúng tôi không tìm thấy kết quả nào trùng khớp.</p>
                    <button 
                      onClick={() => handlePageChange('home', '')}
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                    >
                      Quay lại trang chủ
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* A. STANDALONE ARCHIVE LIST FOR CATEGORIES OR SEARCH */}
            {(selectedCategory || searchQuery) && filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Archive List Column (Left 8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredArticles.map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          navigate(`/article/${art.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border border-slate-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <img 
                            src={art.thumbnail} 
                            alt={art.title}
                            className="w-full h-44 object-cover"
                          />
                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 uppercase">
                              <span>{art.categoryLabel}</span>
                              <span className="text-slate-400">{art.date}</span>
                            </div>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-blue-700 transition line-clamp-2">
                              {art.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 text-justify">
                              {art.summary}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-4 pt-3 border-t border-slate-100/55 flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-500">{art.author}</span>
                          <span className="flex items-center gap-0.5 font-bold text-blue-600">Đọc thêm &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right widgets for archive */}
                <div className="lg:col-span-4 space-y-6">
                  <QuickChecker />
                  
                  {/* Community report panel widget */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <h4 className="font-extrabold text-xs text-rose-700 uppercase tracking-wider border-l-2 border-rose-600 pl-2">
                      Hỗ trợ khẩn cấp 24/7
                    </h4>
                    <p className="text-xs text-slate-600 leading-normal text-justify">
                      Nếu tài khoản của bạn đang có nguy cơ bị xâm nhập trái phép hoặc bạn đã trót chuyển tiền làm nhiệm vụ, hãy kích hoạt ngay Quy trình xử lý sự cố khẩn cấp.
                    </p>
                    <button 
                      onClick={() => handlePageChange('report')}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-lg transition text-center uppercase tracking-wide block"
                    >
                      Báo cáo vụ việc ngay
                    </button>
                  </div>
                </div>

              </div>
            ) : !selectedCategory && !searchQuery ? (
              
              /* B. DENSE HOME MULTI-COLUMN LAYOUT */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ================= COLUMN 1: LEFT SIDEBAR (Width 3/12) ================= */}
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* 1. Feature Alerts list */}
                  <div className="bg-white border border-slate-100/50 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="font-extrabold text-xs text-rose-700 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Cảnh báo nổi bật
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold">MỚI</span>
                    </div>

                    <div className="space-y-3">
                      {warningArticles.map((art) => (
                        <div 
                          key={art.id}
                          onClick={() => {
                            navigate(`/article/${art.slug}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="space-y-1 cursor-pointer group border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
                        >
                          <span className="bg-rose-100 text-rose-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded tracking-wide uppercase">
                            Khẩn cấp
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">{art.date} • {art.views.toLocaleString()} xem</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Safety checklist of the day */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-md">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <ShieldAlert className="w-4.5 h-4.5 text-amber-400" />
                      <h3 className="font-bold text-xs uppercase tracking-wider">Mẹo an toàn hôm nay</h3>
                    </div>

                    <div className="space-y-3 text-xs leading-normal">
                      <div className="p-2 bg-slate-800/60 rounded border border-slate-700/50 space-y-1">
                        <span className="text-amber-400 font-bold">1. Khóa Sim di động:</span>
                        <p className="text-slate-300">Không bao giờ nghe điện thoại tự xưng là "Cục Viễn thông thông báo khóa sim".</p>
                      </div>
                      <div className="p-2 bg-slate-800/60 rounded border border-slate-700/50 space-y-1">
                        <span className="text-amber-400 font-bold">2. Tránh mã độc APK:</span>
                        <p className="text-slate-300">Chỉ cài VNeID trực tiếp từ App Store hoặc Google Play chính chủ.</p>
                      </div>
                      <div className="p-2 bg-slate-800/60 rounded border border-slate-700/50 space-y-1">
                        <span className="text-amber-400 font-bold">3. Xác thực mượn tiền:</span>
                        <p className="text-slate-300">Nếu bạn bè mượn tiền qua chat, bắt buộc phải gọi điện thoại video nói chuyện trước.</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Most Read list */}
                  <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-slate-100/50 hover:shadow-md transition duration-300">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <TrendingUp className="w-4.5 h-4.5 text-blue-700" />
                      <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Đọc nhiều nhất</h3>
                    </div>

                    <div className="space-y-3 divide-y divide-gray-50">
                      {popularArticles.map((art, idx) => (
                        <div 
                          key={art.id}
                          onClick={() => {
                            navigate(`/article/${art.slug}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="pt-2.5 first:pt-0 cursor-pointer group flex gap-2"
                        >
                          <span className="text-lg font-extrabold text-slate-300 group-hover:text-blue-700 transition w-5 text-center">
                            {idx + 1}
                          </span>
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                              {art.title}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase">{art.categoryLabel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ================= COLUMN 2: CENTER MAIN CONTENT (Width 6/12) ================= */}
                <div className="lg:col-span-6 space-y-8">
                  
                  {/* Hero featured story */}
                  <div 
                    onClick={() => {
                      navigate(`/article/${heroArticle.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-slate-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer space-y-4"
                  >
                    <div className="relative">
                      <img 
                        src={heroArticle.thumbnail} 
                        alt={heroArticle.title}
                        className="w-full h-56 sm:h-[320px] object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-widest shadow-sm">
                        Cảnh báo đặc biệt khẩn
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase">
                        <span>{heroArticle.categoryLabel}</span>
                        <span className="text-slate-400">{heroArticle.date}</span>
                      </div>
                      
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight hover:text-blue-700 transition">
                        {heroArticle.title}
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify line-clamp-3">
                        {heroArticle.summary}
                      </p>

                      <div className="pt-4 border-t border-slate-100/55 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold">Nguồn: {heroArticle.author}</span>
                        <span className="text-blue-700 font-bold flex items-center gap-0.5">Chi tiết &rarr;</span>
                      </div>
                    </div>
                  </div>

                  {/* Supporting secondary articles sub-grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {subHeroArticles.map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          navigate(`/article/${art.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border border-slate-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <img 
                            src={art.thumbnail} 
                            alt={art.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-5 space-y-1.5">
                            <span className="text-[10px] font-bold text-blue-700 uppercase">{art.categoryLabel}</span>
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 hover:text-blue-700 line-clamp-2 leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 text-justify">
                              {art.summary}
                            </p>
                          </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-slate-100/55 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{art.date}</span>
                          <span className="font-bold text-blue-600">Đọc ngay &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* ================= COLUMN 3: RIGHT SIDEBAR (Width 3/12) ================= */}
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* 1. Quick checker tool widget */}
                  <QuickChecker />

                  {/* 2. Rapid Scam Statistics counters */}
                  <div className="bg-white border border-slate-100/50 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-blue-700" />
                      <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Hành động bảo vệ</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-xs">
                        <span className="font-bold text-amber-900 block">Sổ tay cẩm nang an toàn số</span>
                        <p className="text-slate-600 text-[11px]">Trang bị toàn diện kỹ năng an toàn thông tin cho mọi lứa tuổi gia đình.</p>
                        <button 
                          onClick={() => handlePageChange('dashboard')}
                          className="text-amber-800 font-bold hover:underline flex items-center gap-0.5 text-[10px] pt-1"
                        >
                          Vào cẩm nang học &rarr;
                        </button>
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1 text-xs">
                        <span className="font-bold text-rose-900 block">Bạn nghi ngờ bị lừa gạt?</span>
                        <p className="text-slate-600 text-[11px]">Hãy gửi ngay phản ánh để chúng tôi phong tỏa tài khoản ngân hàng kẻ lừa đảo.</p>
                        <button 
                          onClick={() => handlePageChange('report')}
                          className="text-rose-800 font-bold hover:underline flex items-center gap-0.5 text-[10px] pt-1"
                        >
                          Trình báo khẩn cấp &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Community trend local notice widget */}
                  <div className="bg-white border border-slate-100/50 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition duration-300">
                    <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-l-2 border-teal-500 pl-2">
                      Cảnh báo địa phương
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="font-bold">TP. Hồ Chí Minh</span>
                        <span className="bg-rose-100 text-rose-800 font-bold text-[9px] px-1.5 py-0.5 rounded">Rất cao</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="font-bold">Hà Nội</span>
                        <span className="bg-rose-100 text-rose-800 font-bold text-[9px] px-1.5 py-0.5 rounded">Rất cao</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="font-bold">Đồng Nai</span>
                        <span className="bg-rose-100 text-rose-800 font-bold text-[9px] px-1.5 py-0.5 rounded">Cao</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ) : null}

            {/* C. LOWER BLOCKS - MULTIPLE ARTICLE GRIDS */}
            {!selectedCategory && !searchQuery && (
              <div className="space-y-8 pt-4 border-t border-slate-200">
                
                {/* Block 1: "Cảnh báo lừa đảo thực tế" Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-red-700 pb-2">
                    <h3 className="font-extrabold text-base text-red-700 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                      Bản tin Cảnh báo lừa đảo trực tuyến
                    </h3>
                    <button 
                      onClick={() => handlePageChange('home', 'canh-bao-lua-dao')}
                      className="text-xs text-red-700 font-bold hover:underline"
                    >
                      Xem tất cả cảnh báo &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ARTICLES.filter(a => a.category === 'canh-bao-lua-dao').slice(0, 3).map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          navigate(`/article/${art.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border border-slate-100/55 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="p-5 space-y-3">
                          <span className="bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                            Mức độ: {art.warningLevel === 'critical' ? 'Rất nghiêm trọng' : 'Nghiêm trọng'}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 hover:text-blue-700">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 text-justify">
                            {art.summary}
                          </p>
                        </div>
                        <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100/55 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                          <span>Nguồn: {art.author}</span>
                          <span className="text-blue-700">Đọc ngay</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 2: "Kiến thức & Kỹ năng số" Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-blue-800 pb-2">
                    <h3 className="font-extrabold text-base text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen className="w-5 h-5 text-blue-700" />
                      Cẩm nang kiến thức & Kỹ năng số
                    </h3>
                    <button 
                      onClick={() => handlePageChange('home', 'kien-thuc')}
                      className="text-xs text-blue-800 font-bold hover:underline"
                    >
                      Vào chuyên trang kiến thức &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.filter(a => a.category === 'meo-huu-ich' || a.category === 'kien-thuc').slice(0, 2).map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          navigate(`/article/${art.slug}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border border-slate-100/50 rounded-2xl overflow-hidden p-5 shadow-sm hover:shadow-md transition duration-300 cursor-pointer flex gap-4"
                      >
                        <img 
                          src={art.thumbnail} 
                          alt={art.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{art.categoryLabel}</span>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug hover:text-blue-700 line-clamp-2">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 text-justify">
                            {art.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 3: Interactive KnowledgePortal and Quick learning Cards */}
                <KnowledgePortal />

                {/* Block 4: Trusted-Source Badges */}
                <div className="bg-white border border-slate-100/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider text-center">
                    Cơ quan hợp tác nghiệp vụ & Đơn vị hỗ trợ khẩn cấp chính quy
                  </h4>
                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 hover:opacity-90 transition">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Bộ Công An
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Bộ Thông tin & Truyền thông
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Hiệp hội ATTT Việt Nam
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Cục An toàn thông tin
                    </div>
                  </div>
                </div>

                {/* Block 5: Community submitted reports - verified list inside home */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                      Mới cập nhật: Nhật ký tin báo từ nhân dân
                    </h3>
                    <button 
                      onClick={() => handlePageChange('report')}
                      className="text-xs text-blue-700 font-bold hover:underline"
                    >
                      Tự gửi tin báo &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {reports.slice(0, 4).map((rep) => (
                      <div key={rep.id} className="bg-white border border-slate-100/50 p-5 rounded-2xl space-y-3 text-xs shadow-sm hover:shadow-md transition duration-300">
                        <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-1.5 text-[10px] text-slate-400 font-bold">
                          <span>{rep.reporterName}</span>
                          <span>{rep.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-rose-50 text-rose-700 font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{rep.scamType}</span>
                          <span className="text-slate-500 font-semibold">nền tảng {rep.platform.toUpperCase()}</span>
                        </div>
                        <p className="font-bold text-slate-800 break-all bg-slate-50/50 p-1.5 rounded font-mono border border-gray-50">
                          {rep.targetInfo}
                        </p>
                        <p className="text-slate-600 line-clamp-3 leading-relaxed text-justify">
                          {rep.description}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-gray-50">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {rep.location}</span>
                          <span className="text-emerald-600 font-bold">✓ Đã tiếp nhận xử lý</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <Footer onPageChange={handlePageChange} />

      {/* AUTHENTICATION DIALOG */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
