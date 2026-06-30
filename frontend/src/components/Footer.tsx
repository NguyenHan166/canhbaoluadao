/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Mail, Phone, ExternalLink, ShieldAlert, Heart } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string, categoryFilter?: any) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const officialSources = [
    { name: 'Cục An toàn thông tin (AIS)', url: 'https://ais.gov.vn' },
    { name: 'Trung tâm Giám sát an toàn không gian mạng (NCSC)', url: 'https://khonggianmang.vn' },
    { name: 'Cổng Cảnh báo an toàn thông tin Việt Nam', url: 'https://canhbao.ncsc.gov.vn' },
    { name: 'Cục Cảnh sát hình sự (C02) - Bộ Công an', url: 'https://bocongan.gov.vn' }
  ];

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 font-sans text-xs sm:text-sm">
      {/* 1. BRAND & DIRECT LINKS */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* About column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 p-2 rounded-md text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-base font-black tracking-widest text-white uppercase">LÁ CHẮN SỐ</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed text-justify">
            Lá Chắn Số là cổng thông tin truyền thông phi lợi nhuận hướng tới bảo vệ công dân trên không gian mạng. 
            Mọi bài viết, hướng dẫn, và cảnh báo được tổng hợp, kiểm chứng chặt chẽ từ các cơ quan Công an, Bộ Thông tin và Truyền thông, và các chuyên gia bảo mật uy tín hàng đầu.
          </p>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <span className="text-red-400 font-extrabold block text-[10px] uppercase tracking-wider">Hotline Phòng chống lừa đảo trực tuyến:</span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <a href="tel:156" className="flex items-center gap-1 text-white hover:text-red-400 font-bold transition">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                156 (Tra cứu & Báo cáo)
              </a>
              <a href="tel:113" className="flex items-center gap-1 text-white hover:text-red-400 font-bold transition">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                113 (Công an khẩn cấp)
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-white font-black text-xs uppercase tracking-wider border-l-4 border-blue-900 pl-2">
            Danh mục tra cứu
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onPageChange('home', 'canh-bao-lua-dao')}
                className="hover:text-blue-400 text-slate-400 transition"
              >
                &bull; Tổng hợp các vụ lừa đảo mới nhất
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange('home', 'kien-thuc')}
                className="hover:text-blue-400 text-slate-400 transition"
              >
                &bull; Kiến thức phòng vệ số cơ bản
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange('home', 'meo-huu-ich')}
                className="hover:text-blue-400 text-slate-400 transition"
              >
                &bull; Kỹ năng bảo vệ tài khoản di động
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange('dashboard')}
                className="hover:text-blue-400 text-slate-400 transition"
              >
                &bull; Thống kê cảnh báo địa phương
              </button>
            </li>
            <li>
              <button 
                onClick={() => onPageChange('report')}
                className="text-red-400 hover:text-red-300 font-semibold transition"
              >
                &bull; Trình báo vụ việc nghi vấn
              </button>
            </li>
          </ul>
        </div>

        {/* Official badges / sources column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-white font-black text-xs uppercase tracking-wider border-l-4 border-blue-900 pl-2">
            Nguồn tin cậy & Liên kết
          </h4>
          <div className="space-y-2">
            {officialSources.map((src, idx) => (
              <a 
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center bg-slate-800/40 p-2 rounded-md hover:bg-slate-800 hover:text-blue-400 transition text-slate-400 text-xs border border-transparent hover:border-slate-700"
              >
                <span className="truncate pr-2">{src.name}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LEGAL DISCLAIMER & CREDIT */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div className="space-y-1 text-center md:text-left max-w-4xl">
            <p className="text-slate-400">
              &copy; {currentYear} <span className="font-bold text-slate-300">Lá Chắn Số Việt Nam</span>. Bảo lưu mọi quyền.
            </p>
            <p className="leading-relaxed text-justify">
              <span className="text-red-500 font-bold">Khuyến cáo:</span> Cổng thông tin hoạt động với mục đích phòng chống tội phạm công nghệ cao và nâng cao cảnh giác cộng đồng. Chúng tôi khuyến nghị người dân luôn đối chiếu, xác minh chéo thông tin trực tiếp với cơ quan công an phường/quận gần nhất khi phát hiện hành vi nghi lừa đảo hình sự.
            </p>
          </div>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span>Dẫn nguồn: Cục ATTT - Bộ TT&TT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
