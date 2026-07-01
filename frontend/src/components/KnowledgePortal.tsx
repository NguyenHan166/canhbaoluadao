import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Globe, 
  Users, 
  CreditCard, 
  CheckCircle 
} from 'lucide-react';
import { SAFETY_TIPS } from '../data/articles';
import { api } from '../services/api';
import { Handbook } from '../types';

interface KnowledgePortalProps {
  fontSize?: 'normal' | 'large' | 'xlarge';
}

export default function KnowledgePortal({ fontSize }: KnowledgePortalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [guides, setGuides] = useState<Handbook[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await api.get('/api/public/handbooks');
        if (res.success) {
          setGuides(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch handbooks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const categories = [
    { id: 'all', label: 'Tất cả cẩm nang', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'account', label: 'Bảo vệ tài khoản', icon: <Lock className="w-4 h-4" /> },
    { id: 'links', label: 'Nhận diện link giả', icon: <Globe className="w-4 h-4" /> },
    { id: 'social', label: 'Mạng xã hội an toàn', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'payment', label: 'Giao dịch online', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'seniors', label: 'Dành cho Người lớn tuổi', icon: <Users className="w-4 h-4" /> }
  ];

  const filteredGuides = activeCategory === 'all' 
    ? guides 
    : guides.filter(g => g.category === activeCategory);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans space-y-8">
      {/* 1. HEADER SECTION */}
      <div className="bg-blue-900 text-white p-6 sm:p-8 rounded-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="bg-white/20 text-white font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-wider w-fit">
            CẨM NANG AN TOÀN SỐ
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight uppercase">
            TRUNG TÂM PHỔ CẬP KIẾN THỨC & KỸ NĂNG BẢO VỆ CỘNG ĐỒNG
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify font-medium">
            Được biên soạn dễ hiểu, ngắn gọn và trực quan, trung tâm kiến thức giúp từng công dân tự trang bị "lá chắn" an toàn khi tham gia thế giới số. Lọc cẩm nang theo nhu cầu cụ thể dưới đây.
          </p>
        </div>
      </div>

      {downloadNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>{downloadNotification}</span>
          </div>
          <button 
            onClick={() => setDownloadNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 2. RULE OF 3 GOLDEN PRINCIPLES */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5.5 h-5.5 text-blue-900" />
          <h3 className="font-black text-xs sm:text-sm text-blue-900 uppercase tracking-wider">QUY TẮC "3 KHÔNG" PHÒNG NGỪA LỪA ĐẢO</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFETY_TIPS[0].points.map((pt, idx) => (
            <div 
              key={idx} 
              className="bg-red-50/50 border border-red-100 p-4 rounded-lg space-y-2 text-xs sm:text-sm hover:shadow-xs transition"
            >
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-red-950 uppercase tracking-wide text-[10px]">Quy tắc thứ {idx + 1}</span>
              </div>
              <p className="text-slate-800 font-semibold leading-relaxed text-justify">
                {pt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeCategory === cat.id 
                ? 'bg-blue-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 4. GUIDES LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div 
            key={guide.id}
            className="bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md hover:border-blue-400 transition-all p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Tagging */}
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="bg-blue-50 text-blue-900 border border-blue-100 px-2 py-0.5 rounded">
                  Độ khó: {guide.difficulty}
                </span>
                <span className="text-slate-400 uppercase tracking-wider">
                  Đối tượng: {guide.recommendFor}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-extrabold text-slate-950 text-sm leading-snug hover:text-blue-900 transition">
                {guide.title}
              </h4>

              <p className="text-xs text-slate-500 leading-relaxed text-justify">
                {guide.summary}
              </p>

              {/* Action checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Thao tác an toàn chính yếu:</span>
                <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom cta action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 italic">Kiểm chứng: Lá Chắn Số</span>
              <button 
                onClick={() => {
                  setDownloadNotification(`Đã chuẩn bị tệp PDF: "${guide.title}" sẵn sàng tải xuống máy của bạn.`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                Tải cẩm nang PDF &rarr;
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* 5. ELDERLY SUPPORT SPECIFIC CORNER */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-blue-900 p-4 rounded-lg text-white shrink-0">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-2 flex-grow">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wide">
            HỖ TRỢ NGƯỜI CAO TUỔI SỬ DỤNG ĐIỆN THOẠI AN TOÀN
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify font-medium">
            Hơn 80% vụ việc lừa đảo công nghệ cao đe dọa tài chính nhắm vào người lớn tuổi do tâm lý dễ lo sợ, cả tin. Hãy chủ động rà soát, cài đặt ứng dụng bảo vệ, khóa số lạ trên máy của cha mẹ và dán cẩm nang Lá Chắn Số ngay tại nơi dễ thấy trong nhà để ngăn ngừa rủi ro.
          </p>
          <div className="flex gap-4 pt-1 flex-wrap text-xs font-bold text-blue-900">
            <span>• Chế độ chữ to thân thiện cho người mắt kém</span>
            <span>• Số điện thoại hỗ trợ 156 / 113 miễn phí</span>
          </div>
        </div>
      </div>

    </div>
  );
}
