import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, PlusCircle, ShieldAlert, FileSearch, 
  FolderHeart, Globe, Users, Settings, LogOut, Search, Bell, Moon, Sun,
  User, CheckSquare, Eye, Edit3, Copy, Trash2, ArrowRight, CornerDownRight,
  TrendingUp, Activity, MessageSquare, ShieldCheck, HelpCircle, Phone, Mail,
  AlertTriangle, Filter, CheckCircle2, ChevronRight, X, Download, FileSpreadsheet,
  Link as LinkIcon, RefreshCw, Layers
} from 'lucide-react';
import { Article, Category, ScamReport } from '../types';
import { 
  NewsSource, AdminUser, WebsiteSettings,
  INITIAL_NEWS_SOURCES, INITIAL_ADMIN_USERS, INITIAL_WEBSITE_SETTINGS 
} from './mockData';
import MediaLibrary from './MediaLibrary';
import ArticleEditor from './ArticleEditor';

interface AdminDashboardProps {
  onLogout: () => void;
  adminEmail: string;
}

export default function AdminDashboard({ onLogout, adminEmail }: AdminDashboardProps) {
  
  // Tab control: dashboard, posts, write, categories, reports, media, sources, users, settings
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Dark/Light layout simulation state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('lanchanso_admin_dark') === 'true';
  });

  // State synchronization with localStorage
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('lanchanso_articles');
    if (saved) return JSON.parse(saved);
    // Fallback: App will initialize this, or we fallback to initial loaded values
    return [];
  });

  const [reports, setReports] = useState<ScamReport[]>(() => {
    const saved = localStorage.getItem('lanchanso_reports');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [newsSources, setNewsSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('lanchanso_news_sources');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lanchanso_news_sources', JSON.stringify(INITIAL_NEWS_SOURCES));
    return INITIAL_NEWS_SOURCES;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('lanchanso_admin_users');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lanchanso_admin_users', JSON.stringify(INITIAL_ADMIN_USERS));
    return INITIAL_ADMIN_USERS;
  });

  const [webSettings, setWebSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('lanchanso_website_settings');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lanchanso_website_settings', JSON.stringify(INITIAL_WEBSITE_SETTINGS));
    return INITIAL_WEBSITE_SETTINGS;
  });

  // Categories list
  const categoriesList: { id: Category; label: string; description: string; color: string; count: number }[] = [
    { id: 'canh-bao-lua-dao', label: 'Cảnh báo lừa đảo', description: 'Các thủ đoạn, kịch bản, và dấu hiệu lừa đảo trực tuyến từ cuộc gọi, Zalo, SMS.', color: 'border-l-rose-600 bg-rose-50/10 text-rose-700', count: articles.filter(a => a.category === 'canh-bao-lua-dao').length },
    { id: 'an-ninh-mang', label: 'An ninh mạng', description: 'Tin bảo mật quốc tế, sự cố lộ lọt dữ liệu, cập nhật mã độc nguy hiểm.', color: 'border-l-blue-600 bg-blue-50/10 text-blue-700', count: articles.filter(a => a.category === 'an-ninh-mang').length },
    { id: 'kien-thuc', label: 'Kiến thức an toàn số', description: 'Khái niệm, thuật ngữ an toàn thông tin cơ bản cho mọi đối tượng.', color: 'border-l-teal-600 bg-teal-50/10 text-teal-700', count: articles.filter(a => a.category === 'kien-thuc').length },
    { id: 'meo-huu-ich', label: 'Kỹ năng & Mẹo', description: 'Hướng dẫn cài đặt bảo mật 2 lớp Facebook, cấu hình thiết bị an toàn.', color: 'border-l-emerald-600 bg-emerald-50/10 text-emerald-700', count: articles.filter(a => a.category === 'meo-huu-ich').length },
    { id: 'cong-dong', label: 'Báo cáo cộng đồng', description: 'Ý kiến đóng góp từ nhân dân, phân tích thống kê thiệt hại từ lừa đảo.', color: 'border-l-indigo-600 bg-indigo-50/10 text-indigo-700', count: articles.filter(a => a.category === 'cong-dong').length }
  ];

  // Selected article for editing
  const [selectedArticleToEdit, setSelectedArticleToEdit] = useState<Article | null>(null);

  // Filters for Articles Table
  const [artFilterSearch, setArtFilterSearch] = useState('');
  const [artFilterCategory, setArtFilterCategory] = useState<Category | ''>('');
  const [artFilterWarn, setArtFilterWarn] = useState<string>('');
  const [artFilterStatus, setArtFilterStatus] = useState<string>('');

  // Selected citizen report for review modal
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [reportNote, setReportNote] = useState('');
  const [hideReporterInfo, setHideReporterInfo] = useState(false);

  // Todo / Reminders list inside Dashboard
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean; priority: 'high' | 'normal' }[]>([
    { id: 't-1', text: 'Xác minh thông tin tên miền "dichvucong-vneid-giamau.apk" do người dân báo cáo', done: false, priority: 'high' },
    { id: 't-2', text: 'Duyệt bài nháp về kịch bản giả shipper lấy tiền COD', done: false, priority: 'high' },
    { id: 't-3', text: 'Cập nhật danh sách nguồn tin an ninh mạng từ Cục ATTT tháng 6/2026', done: true, priority: 'normal' },
    { id: 't-4', text: 'Kiểm tra phản hồi email liên hệ từ người dùng liên quan đến lỗi tra cứu', done: false, priority: 'normal' }
  ]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lanchanso_admin_dark', String(darkMode));
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state helpers
  const saveArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem('lanchanso_articles', JSON.stringify(newArticles));
  };

  const saveReports = (newReports: ScamReport[]) => {
    setReports(newReports);
    localStorage.setItem('lanchanso_reports', JSON.stringify(newReports));
  };

  const saveSources = (newSources: NewsSource[]) => {
    setNewsSources(newSources);
    localStorage.setItem('lanchanso_news_sources', JSON.stringify(newSources));
  };

  const saveUsers = (newUsers: AdminUser[]) => {
    setAdminUsers(newUsers);
    localStorage.setItem('lanchanso_admin_users', JSON.stringify(newUsers));
  };

  const saveSettings = (newSettings: WebsiteSettings) => {
    setWebSettings(newSettings);
    localStorage.setItem('lanchanso_website_settings', JSON.stringify(newSettings));
  };

  // Delete article
  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Bạn có thực sự chắc chắn muốn xóa vĩnh viễn bài viết này? Website công cộng sẽ mất nội dung ngay lập tức.')) {
      const updated = articles.filter(a => a.id !== id);
      saveArticles(updated);
      showToast('Đã xóa bài viết thành công.');
    }
  };

  // Duplicate article
  const handleDuplicateArticle = (art: Article) => {
    const copy: Article = {
      ...art,
      id: `art-dup-${Date.now()}`,
      title: `${art.title} (Bản sao)`,
      slug: `${art.slug}-ban-sao-${Math.floor(Math.random() * 1000)}`,
      views: 0,
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    saveArticles([copy, ...articles]);
    showToast('Đã nhân bản bài viết thành công.');
  };

  // Toggle show/hide article state
  const handleToggleHideArticle = (id: string) => {
    const updated = articles.map(a => {
      if (a.id === id) {
        // Toggle simulated warning level low as draft
        return { ...a, warningLevel: a.warningLevel === 'low' ? 'medium' : 'low' as 'low' | 'medium' };
      }
      return a;
    });
    saveArticles(updated);
    showToast('Đã cập nhật trạng thái hiển thị.');
  };

  // Import mock article from Cục ATTT website
  const handleImportFromSource = () => {
    const titles = [
      'CẢNH BÁO: Xuất hiện trang web giả mạo Ngân hàng Vietcombank để đánh cắp mã OTP kích hoạt Smart OTP',
      'Cảnh giác tin nhắn SMS chứa liên kết lạ thông báo nhận quà tri ân từ thương hiệu thời trang lớn',
      'Phát hiện chiến dịch tán phát mã độc gián điệp qua file tài liệu đính kèm Excel độc hại hòng chiếm đoạt dữ liệu máy tính'
    ];
    const summaries = [
      'Kẻ gian lợi dụng giao diện giống 99% website ngân hàng Vietcombank thật để lừa người dùng nhập tài khoản, mật khẩu rồi kích hoạt OTP từ xa.',
      'Đại diện thương hiệu đưa ra cảnh báo chính thức rằng họ không tổ chức chương trình trúng thưởng qua tin nhắn SMS rác.',
      'Chuyên gia NCSC phát hiện chiến dịch APT tinh vi nhắm vào các doanh nghiệp vừa và nhỏ Việt Nam.'
    ];
    
    const index = Math.floor(Math.random() * titles.length);
    const mockImport: Article = {
      id: `art-imp-${Date.now()}`,
      title: titles[index],
      slug: `tin-nhap-tu-nguon-${Date.now()}`,
      summary: summaries[index],
      category: 'an-ninh-mang',
      categoryLabel: 'An ninh mạng',
      thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
      author: 'Hệ thống nhập tự động',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: '4 phút đọc',
      views: 1,
      warningLevel: 'high',
      sourceName: 'Cục An toàn thông tin - Bộ TT&TT',
      sourceUrl: 'https://ais.gov.vn'
    };

    saveArticles([mockImport, ...articles]);
    showToast('Đã nhập bài viết từ nguồn thành công.');
  };

  // Export list toast
  const handleExportList = () => {
    showToast('Đang tạo file Excel báo cáo... Xuất danh sách thành công!');
  };

  // Save report notes and status
  const handleSaveReportStatus = (status: ScamReport['status']) => {
    if (selectedReport) {
      const updated = reports.map(r => {
        if (r.id === selectedReport.id) {
          return { 
            ...r, 
            status, 
            statusMessage: reportNote || r.statusMessage,
            reporterName: hideReporterInfo ? 'Cư dân ẩn danh' : r.reporterName
          };
        }
        return r;
      });
      saveReports(updated);
      setSelectedReport(null);
      setReportNote('');
      showToast('Đã cập nhật trạng thái phản ánh.');
    }
  };

  // Transform report into dynamic post draft
  const handleConvertReportToPost = (rep: ScamReport) => {
    setSelectedArticleToEdit({
      id: `art-conv-${Date.now()}`,
      title: `CẢNH BÁO: Thủ đoạn lừa đảo qua ${rep.scamType.toUpperCase()} nhắm vào đối tượng tại ${rep.location || 'Việt Nam'}`,
      slug: `canh-bao-lua-dao-qua-${rep.platform}-${Date.now()}`,
      summary: `Hệ thống tiếp nhận phản ánh nghi vấn lừa đảo liên quan đến: ${rep.targetInfo}. Mô tả vụ việc: ${rep.description}`,
      category: 'canh-bao-lua-dao',
      categoryLabel: 'Cảnh báo lừa đảo',
      thumbnail: rep.screenshotUrl || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
      author: 'Ban biên tập Lá Chắn Số',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: '3 phút đọc',
      views: 0,
      warningLevel: 'high',
      sourceName: 'Phản ánh từ nhân dân',
      quickSummaryPoints: [
        `Phản ánh xảy ra trên nền tảng: ${rep.platform.toUpperCase()}`,
        `Thông tin tài khoản/số điện thoại bị tố cáo: ${rep.targetInfo}`
      ],
      content: `<p>Ban biên tập Lá Chắn Số vừa tiếp nhận tin báo có mức độ xác thực cao từ người dân tại địa phương <strong>${rep.location}</strong> về thủ đoạn lừa đảo trực tuyến mới.</p><blockquote><strong>Chi tiết thông tin phản ánh:</strong><br/>${rep.description}</blockquote><p>Hiện nay cơ quan kỹ thuật đã đưa tài khoản/liên kết <code>${rep.targetInfo}</code> vào danh sách giám sát và hạn chế truy cập.</p>`
    });
    setSelectedReport(null);
    setActiveTab('write');
    showToast('Đã chuyển đổi báo cáo thành bản phác thảo bài viết.');
  };

  // Add custom reference news source
  const handleAddNewsSource = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newSrc: NewsSource = {
      id: `src-added-${Date.now()}`,
      name: fd.get('name') as string,
      type: fd.get('type') as NewsSource['type'],
      website: fd.get('website') as string,
      description: fd.get('description') as string,
      trustedStatus: 'verified'
    };
    saveSources([newSrc, ...newsSources]);
    e.currentTarget.reset();
    showToast('Thêm nguồn tin mới thành công.');
  };

  // Add mock admin account
  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newUser: AdminUser = {
      id: `u-added-${Date.now()}`,
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as AdminUser['role'],
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fd.get('name')}`,
      permissions: ['create_post', 'edit_post']
    };
    saveUsers([...adminUsers, newUser]);
    e.currentTarget.reset();
    showToast('Tạo tài khoản admin mới thành công.');
  };

  // Toggle todo item
  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Filter articles based on user parameters
  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(artFilterSearch.toLowerCase()) || 
                          a.summary.toLowerCase().includes(artFilterSearch.toLowerCase()) ||
                          (a.author && a.author.toLowerCase().includes(artFilterSearch.toLowerCase()));
    const matchesCategory = artFilterCategory ? a.category === artFilterCategory : true;
    const matchesWarn = artFilterWarn ? a.warningLevel === artFilterWarn : true;
    // status mapping: published is low/critical, draft is medium-low
    const matchesStatus = artFilterStatus ? (
      artFilterStatus === 'published' ? a.warningLevel !== 'low' : 
      artFilterStatus === 'draft' ? a.warningLevel === 'low' : true
    ) : true;
    return matchesSearch && matchesCategory && matchesWarn && matchesStatus;
  });

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-300`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 border border-emerald-600 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-100 font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex min-h-screen">
        
        {/* SIDEBAR NAVIGATION PANEL */}
        <aside className={`w-64 border-r ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-200'} text-slate-200 flex flex-col justify-between flex-shrink-0 z-20`}>
          <div className="p-5 space-y-6">
            {/* Branding Logo */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="h-10 w-10 rounded-xl bg-blue-700/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-widest">LÁ CHẮN SỐ</h1>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">CMS Portal v1.0</span>
              </div>
            </div>

            {/* Nav List */}
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Bảng Điều Khiển', icon: LayoutDashboard },
                { id: 'posts', label: 'Bài Viết Bảo Mật', icon: FileText },
                { id: 'write', label: 'Soạn Thảo Bài Mới', icon: PlusCircle, count: articles.filter(a => a.warningLevel === 'low').length ? 'Drafts' : undefined },
                { id: 'categories', label: 'Chuyên Mục', icon: Layers },
                { id: 'reports', label: 'Phản Ánh Dân Gửi', icon: ShieldAlert, count: reports.filter(r => r.status === 'pending').length },
                { id: 'media', label: 'Thư Viện Tệp Tin', icon: FolderHeart },
                { id: 'sources', label: 'Nguồn Tin Tức', icon: Globe },
                { id: 'users', label: 'Tài Khoản & Quyền', icon: Users },
                { id: 'settings', label: 'Cấu Hình Website', icon: Settings }
              ].map(item => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'write') {
                        setSelectedArticleToEdit(null);
                      }
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isSelected 
                        ? 'bg-blue-900 text-white shadow' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="bg-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Admin Footer profile */}
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/20">
            <div className="flex items-center gap-2.5">
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=nvhan`} 
                alt="admin-avatar" 
                className="w-8 h-8 rounded-full border border-blue-500/30 bg-slate-800"
              />
              <div className="truncate text-xs">
                <p className="font-bold text-white text-[11px]">Nguyễn Văn Hân</p>
                <p className="text-[9px] text-slate-500 font-mono truncate">{adminEmail}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-800 hover:border-rose-900 bg-slate-900 hover:bg-rose-950/10 text-rose-500 hover:text-rose-400 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất hệ thống</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY AND TOPBAR WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOPBAR PANEL */}
          <header className={`h-16 border-b px-6 flex items-center justify-between ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } relative z-10`}>
            {/* Left quick check search bar */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tra cứu bài viết, báo cáo nhanh..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              {/* Shortcut Write New button */}
              <button
                onClick={() => {
                  setSelectedArticleToEdit(null);
                  setActiveTab('write');
                }}
                className="bg-blue-900 hover:bg-blue-850 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Viết bài mới</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl border transition ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-yellow-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Chuyển đổi giao diện sáng/tối"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Alert Center notifications popup */}
              <button className={`p-2 rounded-xl border relative transition ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <Bell className="w-4 h-4" />
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                )}
              </button>

              <span className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

              {/* Mini User Display */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold hidden md:inline text-slate-600 dark:text-slate-300">ADMIN</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded">ONLINE</span>
              </div>
            </div>
          </header>

          {/* MAIN INTERNAL WORKSPACE VIEWPORT */}
          <main className="flex-1 p-6 overflow-y-auto">
            
            {/* =========================================
                TAB 1: OVERVIEW DASHBOARD
                ========================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Statistics Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { title: 'TỔNG SỐ BÀI VIẾT', value: articles.length, desc: `${articles.filter(a => a.warningLevel !== 'low').length} Đã xuất bản • ${articles.filter(a => a.warningLevel === 'low').length} Bản nháp`, icon: FileText, color: 'text-blue-600 bg-blue-500/10' },
                    { title: 'CẢNH BÁO KHẨN CẤP', value: articles.filter(a => a.warningLevel === 'critical' || a.warningLevel === 'high').length, desc: 'Đã phát sóng ngoài trang chủ', icon: ShieldAlert, color: 'text-rose-600 bg-rose-500/10 border border-rose-500/20' },
                    { title: 'BÁO CÁO TỪ NGƯỜI DÂN', value: reports.length, desc: `${reports.filter(r => r.status === 'pending').length} Hồ sơ chờ xác minh`, icon: ShieldAlert, color: 'text-amber-600 bg-amber-500/10' },
                    { title: 'LƯỢT XEM HÔM NAY', value: '45,892 Lượt', desc: '+15.2% so với hôm qua', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-500/10' }
                  ].map((card, i) => (
                    <div key={i} className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                    }`}>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{card.title}</span>
                        <p className="text-2xl font-extrabold tracking-tight">{card.value}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">{card.desc}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${card.color} flex-shrink-0`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical charts and task board splits */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left chart SVG panel */}
                  <div className={`lg:col-span-2 p-5 rounded-2xl border shadow-sm space-y-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-700" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider">Lưu lượng truy cập cổng thông tin</h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded">Tháng 6, 2026</span>
                    </div>

                    {/* SVG Line Chart for Traffic - Elegant & responsive without massive charting bundles */}
                    <div className="h-64 relative flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        {/* Decorative background grid lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="1" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="1" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="1" />
                        
                        {/* Gradient Fill under path */}
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,150 Q70,90 140,110 T280,60 T420,40 L500,80 L500,200 L0,200 Z" fill="url(#chart-grad)" />

                        {/* Line Path */}
                        <path 
                          d="M0,150 Q70,90 140,110 T280,60 T420,40 L500,80" 
                          fill="none" 
                          stroke="#1d4ed8" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />

                        {/* Interactive Nodes and data points */}
                        <circle cx="140" cy="110" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="280" cy="60" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="420" cy="40" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                      </svg>
                      {/* Data tags */}
                      <div className="absolute top-[20px] left-[78%] bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow">
                        Hôm nay: 45K views
                      </div>
                    </div>
                  </div>

                  {/* Right Reminders / Todo List pane */}
                  <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <CheckSquare className="w-5 h-5 text-blue-700" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider">Khu vực nhắc việc Ban biên tập</h3>
                    </div>

                    <div className="space-y-3">
                      {todos.map(todo => (
                        <div 
                          key={todo.id} 
                          onClick={() => handleToggleTodo(todo.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            todo.done 
                              ? 'bg-slate-500/5 border-transparent opacity-50' 
                              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 dark:border-slate-800 dark:bg-slate-950/20'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={todo.done} 
                            onChange={() => {}} 
                            className="h-4 w-4 text-blue-900 rounded border-slate-200 mt-0.5" 
                          />
                          <div className="space-y-1">
                            <p className={`text-xs font-semibold leading-relaxed ${todo.done ? 'line-through text-slate-400' : ''}`}>
                              {todo.text}
                            </p>
                            {todo.priority === 'high' && !todo.done && (
                              <span className="bg-rose-100 text-rose-700 font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded">Gấp</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Double table panels inside overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Recent Scam reports */}
                  <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider">Tin báo khẩn của cư dân</h3>
                      </div>
                      <button onClick={() => setActiveTab('reports')} className="text-xs text-blue-700 hover:underline font-bold">Xem tất cả &rarr;</button>
                    </div>

                    <div className="space-y-3">
                      {reports.slice(0, 3).map(rep => (
                        <div 
                          key={rep.id} 
                          onClick={() => {
                            setSelectedReport(rep);
                            setReportNote(rep.statusMessage || '');
                          }}
                          className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/20 cursor-pointer transition"
                        >
                          <div className="space-y-1 truncate max-w-[75%]">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{rep.targetInfo}</p>
                            <p className="text-[11px] text-slate-500 truncate leading-relaxed">{rep.description}</p>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                              <span>Nền tảng {rep.platform.toUpperCase()}</span>
                              <span>•</span>
                              <span>{rep.createdAt}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide rounded ${
                            rep.status === 'pending' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {rep.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Latest publications */}
                  <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-700" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider">Cảnh báo vừa xuất bản</h3>
                      </div>
                      <button onClick={() => setActiveTab('posts')} className="text-xs text-blue-700 hover:underline font-bold">Xem bài viết &rarr;</button>
                    </div>

                    <div className="space-y-3">
                      {articles.slice(0, 3).map(art => (
                        <div 
                          key={art.id}
                          className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-xl"
                        >
                          <div className="space-y-1 truncate max-w-[80%]">
                            <p className="text-xs font-bold truncate">{art.title}</p>
                            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-semibold">
                              <span className="bg-blue-500/15 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">{art.categoryLabel}</span>
                              <span>{art.date}</span>
                              <span>•</span>
                              <span>{art.views} lượt xem</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedArticleToEdit(art);
                              setActiveTab('write');
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded text-blue-700 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =========================================
                TAB 2: POSTS LISTING TABLE
                ========================================= */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                
                {/* Control elements */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedArticleToEdit(null);
                        setActiveTab('write');
                      }}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-850 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Viết bài mới</span>
                    </button>

                    <button
                      onClick={handleImportFromSource}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Nhập bài từ nguồn</span>
                    </button>

                    <button
                      onClick={handleExportList}
                      className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 transition"
                      title="Xuất Excel danh sách"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    </button>
                  </div>

                  {/* Search and filter toolbar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        value={artFilterSearch}
                        onChange={(e) => setArtFilterSearch(e.target.value)}
                        className={`pl-8 pr-3 py-1.5 border rounded-lg text-xs w-36 focus:outline-none focus:ring-1 focus:ring-blue-700 ${
                          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    {/* Filter category */}
                    <select
                      value={artFilterCategory}
                      onChange={(e) => setArtFilterCategory(e.target.value as Category | '')}
                      className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="">Chuyên mục (Tất cả)</option>
                      {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>

                    {/* Filter level */}
                    <select
                      value={artFilterWarn}
                      onChange={(e) => setArtFilterWarn(e.target.value)}
                      className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="">Cảnh báo (Tất cả)</option>
                      <option value="low">🟢 Bình thường</option>
                      <option value="medium">🟡 Cần chú ý</option>
                      <option value="high">🟠 Khẩn cấp (Cao)</option>
                      <option value="critical">🔴 Đặc biệt nguy hiểm</option>
                    </select>

                    {/* Filter status */}
                    <select
                      value={artFilterStatus}
                      onChange={(e) => setArtFilterStatus(e.target.value)}
                      className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="">Trạng thái (Tất cả)</option>
                      <option value="published">Đã xuất bản</option>
                      <option value="draft">Bản nháp</option>
                    </select>
                  </div>
                </div>

                {/* Articles list table container */}
                <div className={`border rounded-2xl overflow-hidden shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[10px] uppercase font-extrabold tracking-wider ${
                          darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}>
                          <th className="py-3.5 px-4 max-w-[280px]">Tiêu đề bài viết</th>
                          <th className="py-3.5 px-3">Chuyên mục</th>
                          <th className="py-3.5 px-3 text-center">Cảnh báo</th>
                          <th className="py-3.5 px-3">Nguồn tham khảo</th>
                          <th className="py-3.5 px-3 text-center">Lượt xem</th>
                          <th className="py-3.5 px-3">Người đăng</th>
                          <th className="py-3.5 px-3">Ngày xuất bản</th>
                          <th className="py-3.5 px-4 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {filteredArticles.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-10 text-slate-400 font-semibold">
                              Không tìm thấy bài viết nào phù hợp bộ lọc.
                            </td>
                          </tr>
                        ) : (
                          filteredArticles.map(art => {
                            const isDraft = art.warningLevel === 'low';
                            return (
                              <tr key={art.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition">
                                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[280px] truncate" title={art.title}>
                                  {art.title}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded font-extrabold uppercase text-[9px]">
                                    {art.categoryLabel}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                    art.warningLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                    art.warningLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                    art.warningLevel === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {art.warningLevel === 'critical' ? '🔴 Khẩn cấp' :
                                     art.warningLevel === 'high' ? '🟠 Nguy hại' :
                                     art.warningLevel === 'medium' ? '🟡 Chú ý' : '🟢 Thường'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-slate-500 max-w-[120px] truncate font-medium">
                                  {art.sourceName || 'Chính thức'}
                                </td>
                                <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                                  {art.views.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-3 text-slate-500 font-semibold">{art.author}</td>
                                <td className="py-3.5 px-3 text-slate-500 font-mono">{art.date}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {/* Edit button */}
                                    <button
                                      onClick={() => {
                                        setSelectedArticleToEdit(art);
                                        setActiveTab('write');
                                      }}
                                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-blue-700 transition"
                                      title="Sửa bài viết"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Duplicate button */}
                                    <button
                                      onClick={() => handleDuplicateArticle(art)}
                                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-emerald-600 transition"
                                      title="Nhân bản"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Hide toggle */}
                                    <button
                                      onClick={() => handleToggleHideArticle(art.id)}
                                      className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition ${
                                        isDraft ? 'text-slate-400' : 'text-amber-600'
                                      }`}
                                      title={isDraft ? 'Hiện bài' : 'Ẩn bài'}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete button */}
                                    <button
                                      onClick={() => handleDeleteArticle(art.id)}
                                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-rose-600 transition"
                                      title="Xóa vĩnh viễn"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================
                TAB 3: WRITE & EDIT WORKSPACE
                ========================================= */}
            {activeTab === 'write' && (
              <ArticleEditor 
                articleToEdit={selectedArticleToEdit}
                categories={categoriesList}
                newsSources={newsSources}
                onCancel={() => {
                  setSelectedArticleToEdit(null);
                  setActiveTab('posts');
                }}
                onSave={(compiled) => {
                  const alreadyExists = articles.some(a => a.id === compiled.id);
                  if (alreadyExists) {
                    const updated = articles.map(a => a.id === compiled.id ? compiled : a);
                    saveArticles(updated);
                    showToast('Đã lưu bài viết chỉnh sửa thành công!');
                  } else {
                    saveArticles([compiled, ...articles]);
                    showToast('Đã phát sóng bài viết mới ra trang chủ thành công!');
                  }
                  setSelectedArticleToEdit(null);
                  setActiveTab('posts');
                }}
              />
            )}

            {/* =========================================
                TAB 4: MANAGE CATEGORIES
                ========================================= */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form to create Category */}
                <div className={`lg:col-span-4 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Thêm chuyên mục</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Đã lưu chuyên mục mới thành công.');
                  }} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Tên chuyên mục</label>
                      <input type="text" placeholder="VD: Bảo mật cá nhân" className="w-full border rounded-xl px-3 py-2" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Slug</label>
                      <input type="text" placeholder="bao-mat-ca-nhan" className="w-full border rounded-xl px-3 py-2 font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Mô tả ngắn</label>
                      <textarea rows={2} placeholder="Tin tức, mẹo thiết lập mật khẩu an toàn..." className="w-full border rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Chuyên mục cha</label>
                      <select className="w-full border rounded-xl px-3 py-2 bg-white">
                        <option value="">Không có</option>
                        {categoriesList.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Icon đại diện (Tên Lucide)</label>
                      <input type="text" placeholder="Shield" className="w-full border rounded-xl px-3 py-2" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-850 transition shadow-sm">
                      LƯU CHUYÊN MỤC
                    </button>
                  </form>
                </div>

                {/* Categories table */}
                <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Các chuyên mục hiện có</h3>
                  <div className="space-y-2.5">
                    {categoriesList.map(c => (
                      <div key={c.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950/20 transition">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{c.label}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded font-mono">{c.id}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{c.description}</p>
                        </div>
                        <span className="bg-blue-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">{c.count} bài</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* =========================================
                TAB 5: SCAM REPORTS BY CITIZENS
                ========================================= */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                
                {/* Reports Listing Table */}
                <div className={`border rounded-2xl overflow-hidden shadow-sm ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[10px] uppercase font-extrabold tracking-wider ${
                          darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}>
                          <th className="py-3.5 px-4">Người gửi</th>
                          <th className="py-3.5 px-3">Nền tảng</th>
                          <th className="py-3.5 px-3">Nội dung tố cáo (Số ĐT/Link)</th>
                          <th className="py-3.5 px-3">Mô tả vụ việc</th>
                          <th className="py-3.5 px-3">Địa phương</th>
                          <th className="py-3.5 px-3">Thời gian nhận</th>
                          <th className="py-3.5 px-3">Trạng thái xử lý</th>
                          <th className="py-3.5 px-4 text-center">Xác minh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {reports.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-10 text-slate-400 font-semibold">
                              Chưa có phản ánh lừa đảo nào do người dân gửi đến hệ thống.
                            </td>
                          </tr>
                        ) : (
                          reports.map(rep => (
                            <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition">
                              <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                                {rep.reporterName || 'Cư dân ẩn danh'}
                                <p className="text-[9px] text-slate-400 font-mono">{rep.reporterContact || 'không để lại liên lạc'}</p>
                              </td>
                              <td className="py-3.5 px-3 uppercase font-extrabold font-mono text-[9px] text-slate-500">
                                {rep.platform}
                              </td>
                              <td className="py-3.5 px-3 font-mono font-bold text-blue-900 dark:text-blue-400 break-all max-w-[150px]">
                                {rep.targetInfo}
                              </td>
                              <td className="py-3.5 px-3 text-slate-500 max-w-[220px] truncate leading-relaxed text-justify" title={rep.description}>
                                {rep.description}
                              </td>
                              <td className="py-3.5 px-3 text-slate-500 font-semibold">{rep.location || 'Toàn quốc'}</td>
                              <td className="py-3.5 px-3 text-slate-500 font-mono">{rep.createdAt}</td>
                              <td className="py-3.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  rep.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  rep.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {rep.status === 'pending' ? 'Chờ kiểm tra' :
                                   rep.status === 'verified' ? 'Đã xác minh' : 'Cần chú ý'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedReport(rep);
                                    setReportNote(rep.statusMessage || '');
                                  }}
                                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-850 transition"
                                >
                                  Duyệt tin
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================
                TAB 6: MEDIA LIBRARY FILE MANAGER
                ========================================= */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-4">
                  <MediaLibrary />
                </div>
              </div>
            )}

            {/* =========================================
                TAB 7: REFERENCE NEWS SOURCES
                ========================================= */}
            {activeTab === 'sources' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form adding News Source */}
                <div className={`lg:col-span-4 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Thêm nguồn tin mới</h3>
                  <form onSubmit={handleAddNewsSource} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Tên nguồn tin chính thống</label>
                      <input type="text" name="name" placeholder="Cục An toàn thông tin" className="w-full border rounded-xl px-3 py-2" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Phân loại nguồn</label>
                      <select name="type" className="w-full border rounded-xl px-3 py-2 bg-white">
                        <option value="government">Cơ quan nhà nước</option>
                        <option value="press">Báo chí điện tử chính quy</option>
                        <option value="bank">Ngân hàng nhà nước/TMCP</option>
                        <option value="security">Tổ chức an ninh mạng</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Website URL</label>
                      <input type="url" name="website" placeholder="https://ais.gov.vn" className="w-full border rounded-xl px-3 py-2" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Mô tả ngắn</label>
                      <textarea name="description" rows={3} placeholder="Mô tả tôn chỉ hoạt động..." className="w-full border rounded-xl px-3 py-2" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-850 transition">
                      THÊM NGUỒN TIN
                    </button>
                  </form>
                </div>

                {/* Sources listing */}
                <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Hệ thống nguồn chính thống liên kết</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newsSources.map(src => (
                      <div key={src.id} className="p-4 border rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            src.type === 'government' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {src.type === 'government' ? 'Cơ quan nhà nước' : 'Báo chí'}
                          </span>
                          <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-1">✓ ĐÃ TIN CẬY</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">{src.name}</h4>
                          <a href={src.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 font-mono hover:underline">
                            <LinkIcon className="w-3 h-3" />
                            {src.website}
                          </a>
                          <p className="text-[11px] text-slate-500 text-justify">{src.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* =========================================
                TAB 8: ROLES AND USER PERMISSIONS
                ========================================= */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form add new Admin */}
                <div className={`lg:col-span-4 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Thêm Quản trị viên</h3>
                  <form onSubmit={handleAddAdminUser} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Họ và tên</label>
                      <input type="text" name="name" placeholder="Nguyễn Văn A" className="w-full border rounded-xl px-3 py-2" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Email công vụ</label>
                      <input type="email" name="email" placeholder="anv@lanchanso.gov.vn" className="w-full border rounded-xl px-3 py-2" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Vai trò phân quyền</label>
                      <select name="role" className="w-full border rounded-xl px-3 py-2 bg-white">
                        <option value="editor">Biên tập viên (Viết bài)</option>
                        <option value="reviewer">Người duyệt bài (Duyệt/Ẩn bài)</option>
                        <option value="reporter_manager">Quản lý phản ánh dân gửi</option>
                        <option value="viewer">Chỉ xem báo cáo</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-850 transition">
                      TẠO TÀI KHOẢN
                    </button>
                  </form>
                </div>

                {/* Listing admin accounts */}
                <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Đội ngũ ban quản trị cổng thông tin</h3>
                  
                  <div className="space-y-3">
                    {adminUsers.map(user => (
                      <div key={user.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                        <div className="flex items-center gap-3">
                          <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border bg-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            user.role === 'super_admin' ? 'bg-blue-900 text-white' :
                            user.role === 'editor' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role === 'super_admin' ? 'Super Admin' : user.role === 'editor' ? 'Biên Tập Viên' : 'Duyệt Bài'}
                          </span>
                          <p className="text-[9px] text-slate-400 font-semibold">{user.status === 'active' ? '● Hoạt động bình thường' : '○ Tạm khóa'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* =========================================
                TAB 9: CONFIG WEBSITE SETTINGS
                ========================================= */}
            {activeTab === 'settings' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                showToast('Đã lưu cấu hình hệ thống Lá Chắn Số thành công!');
              }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Site details */}
                <div className={`lg:col-span-8 p-5 rounded-2xl border shadow-sm space-y-4 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Thông tin nhận diện và chính sách</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Tên website</label>
                      <input type="text" value={webSettings.siteName} onChange={(e) => setWebSettings({ ...webSettings, siteName: e.target.value })} className="w-full border rounded-xl px-3 py-2 font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-400">Số hotline liên hệ khẩn</label>
                      <input type="text" value={webSettings.contactPhone} onChange={(e) => setWebSettings({ ...webSettings, contactPhone: e.target.value })} className="w-full border rounded-xl px-3 py-2 font-mono" />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-400">Mô tả giới thiệu Footer</label>
                    <textarea rows={3} value={webSettings.footerContent} onChange={(e) => setWebSettings({ ...webSettings, footerContent: e.target.value })} className="w-full border rounded-xl px-3 py-2 leading-relaxed" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-400">Điều khoản miễn trừ trách nhiệm</label>
                    <textarea rows={3} value={webSettings.disclaimer} onChange={(e) => setWebSettings({ ...webSettings, disclaimer: e.target.value })} className="w-full border rounded-xl px-3 py-2 leading-relaxed" />
                  </div>
                </div>

                {/* Contacts & SEO Default setup */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Contact configurations */}
                  <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider border-b pb-2">Kênh mạng xã hội & SEO</h3>
                    
                    <div className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400">Email quản trị</label>
                        <input type="email" value={webSettings.contactEmail} onChange={(e) => setWebSettings({ ...webSettings, contactEmail: e.target.value })} className="w-full border rounded-xl px-3 py-1.5" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400">Facebook Page</label>
                        <input type="text" value={webSettings.socialLinks.facebook} onChange={(e) => setWebSettings({ ...webSettings, socialLinks: { ...webSettings.socialLinks, facebook: e.target.value } })} className="w-full border rounded-xl px-3 py-1.5 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400">Zalo OA</label>
                        <input type="text" value={webSettings.socialLinks.zalo} onChange={(e) => setWebSettings({ ...webSettings, socialLinks: { ...webSettings.socialLinks, zalo: e.target.value } })} className="w-full border rounded-xl px-3 py-1.5 font-mono" />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-850 transition shadow-sm text-xs">
                      LƯU CẤU HÌNH HỆ THỐNG
                    </button>
                  </div>

                </div>

              </form>
            )}

          </main>
        </div>

      </div>

      {/* =========================================
          REVIEW CITIZEN REPORT DIALOG MODAL
          ========================================= */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-2xl w-full">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                  Hồ sơ tố giác lừa đảo trực tuyến
                </h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedReport(null);
                  setReportNote('');
                }}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
              
              {/* Target info big text */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-widest block">Đối tượng bị tố giác</span>
                <p className="text-lg font-mono font-bold text-rose-950 break-all">{selectedReport.targetInfo}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-900 text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">Nền tảng: {selectedReport.platform.toUpperCase()}</span>
                  <span className="bg-rose-100 text-rose-800 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">{selectedReport.scamType}</span>
                </div>
              </div>

              {/* Submited user details */}
              <div className="grid grid-cols-2 gap-4 border-b pb-4 border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Người gửi phản ánh</span>
                  <strong className="text-slate-800">{selectedReport.reporterName || 'Cư dân ẩn danh'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Thông tin liên lạc</span>
                  <strong className="text-slate-800 font-mono">{selectedReport.reporterContact || 'không có'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Địa phương xảy ra</span>
                  <strong className="text-slate-800">{selectedReport.location || 'Toàn quốc'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Thời gian gửi hệ thống</span>
                  <strong className="text-slate-800 font-mono">{selectedReport.createdAt}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Mô tả chi tiết kịch bản lừa đảo</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed text-justify">
                  {selectedReport.description}
                </p>
              </div>

              {/* Proof screenshot mock preview */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Ảnh chụp bằng chứng đính kèm</span>
                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center group shadow border border-slate-800 max-h-[160px]">
                  {selectedReport.screenshotUrl ? (
                    <img src={selectedReport.screenshotUrl} alt="by-user" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <FileText className="w-8 h-8 text-slate-500 mx-auto mb-1.5" />
                      <span className="text-slate-500 font-medium text-[11px]">Người dân không đính kèm ảnh chụp tin nhắn</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Review notes fields */}
              <div className="space-y-3.5 border-t pt-4 border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-extrabold uppercase text-[10px] tracking-wide block">Bút ký thẩm định của Ban biên tập</span>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="hide-info" 
                      checked={hideReporterInfo}
                      onChange={(e) => setHideReporterInfo(e.target.checked)}
                      className="h-3.5 w-3.5 text-blue-900 rounded border-slate-200" 
                    />
                    <label htmlFor="hide-info" className="text-[10px] text-slate-500 font-semibold cursor-pointer">Ẩn danh tính công dân</label>
                  </div>
                </div>

                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Ghi chú nội bộ: Số điện thoại này trùng khớp với phản ánh từ công an Hà Nội ngày 25/6..."
                  className="w-full border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 leading-relaxed bg-slate-50/50"
                  rows={2}
                />
              </div>

            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleConvertReportToPost(selectedReport)}
                className="px-4 py-2 border border-blue-900 bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Chuyển thành bài viết cảnh báo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReportNote('');
                  }}
                  className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Đóng lại
                </button>
                <button
                  onClick={() => handleSaveReportStatus('verified')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Phê duyệt & Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
