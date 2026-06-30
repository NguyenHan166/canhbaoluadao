/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Copy, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ArrowLeft,
  Check,
  Building2,
  Calendar,
  AlertOctagon,
  BellRing
} from 'lucide-react';
import { ScamReport, User as UserType } from '../types';

interface MyAccountProps {
  currentUser: UserType | null;
  reports: ScamReport[];
  fontSize?: 'normal' | 'large' | 'xlarge';
  onBackToHome: () => void;
  onNavigateToReport: () => void;
  onOpenLogin: () => void;
}

export default function MyAccount({ 
  currentUser, 
  reports, 
  fontSize, 
  onBackToHome, 
  onNavigateToReport,
  onOpenLogin
}: MyAccountProps) {
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'attention'>('all');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100/60 shadow-lg p-8 sm:p-12 text-center max-w-xl mx-auto my-12 space-y-6">
        <div className="bg-blue-50 text-blue-900 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Yêu cầu đăng nhập</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Vui lòng đăng nhập tài khoản Lá Chắn Số để xem lại hồ sơ cá nhân và lịch sử các phản ánh, báo cáo lừa đảo mà bạn đã gửi lên hệ thống.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onOpenLogin}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition duration-300 shadow-md shadow-blue-100"
          >
            Đăng nhập ngay
          </button>
          <button
            onClick={onBackToHome}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition duration-300"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Dual-matching logic: match by user's unique ID, or matching contact details
  const myReports = reports.filter(rep => {
    const matchesUid = rep.userId === currentUser.uid;
    const matchesEmail = rep.reporterContact?.toLowerCase() === currentUser.email.toLowerCase();
    const matchesPhone = currentUser.phone && rep.reporterContact === currentUser.phone;
    return matchesUid || matchesEmail || matchesPhone;
  });

  // Apply search & status filters
  const filteredReports = myReports.filter(rep => {
    const matchesSearch = 
      rep.scamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.targetInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.ticketId && rep.ticketId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    if (expandedReportId === id) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(id);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100/80',
          dot: 'bg-emerald-500',
          label: 'Đã xác minh lừa đảo',
          desc: 'Nội dung phản ánh đã được kiểm chứng, đưa vào cơ sở dữ liệu quốc gia và chuyển tiếp cơ quan chức năng.'
        };
      case 'attention':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100/80',
          dot: 'bg-amber-500',
          label: 'Độ tin cậy cao / Đang điều tra',
          desc: 'Phản ánh có cơ sở dữ liệu mạnh, đang được chuyên viên an ninh mạng phân tích và phối hợp định vị đối tượng.'
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-100/80',
          dot: 'bg-blue-500 animate-pulse',
          label: 'Đang tiếp nhận & xử lý',
          desc: 'Hồ sơ đã được lưu trữ thành công. Ban quản trị đang xử lý đối chiếu thông tin.'
        };
    }
  };

  const getPlatformLabel = (p: string) => {
    const labels: Record<string, string> = {
      facebook: 'Facebook',
      zalo: 'Zalo',
      sms: 'SMS',
      call: 'Cuộc gọi di động',
      email: 'Email',
      website: 'Website / Đường dẫn',
      tmdt: 'Thương mại điện tử',
      other: 'Hình thức khác'
    };
    return labels[p] || p;
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto" id="my-account-page">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-900 font-bold transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight">Tài khoản của tôi</h2>
          <p className="text-xs text-slate-500">Quản lý hồ sơ người dùng và theo dõi kết quả xử lý tin phản ánh</p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition duration-300 shadow-md shadow-red-100 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Báo cáo vụ việc mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR: USER INFO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100/50 shadow-sm p-6 space-y-6">
            <div className="text-center space-y-3 pb-6 border-b border-slate-100">
              <div className="relative inline-block">
                <img 
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                  alt={currentUser.name} 
                  className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-md mx-auto object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Tài khoản hoạt động">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{currentUser.name}</h3>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1">
                  Thành viên Lá Chắn Số
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <h4 className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Thông tin cá nhân</h4>
              
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold text-[9px] uppercase">Email</span>
                  <span className="font-semibold text-slate-800 text-[11px] break-all">{currentUser.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold text-[9px] uppercase">Số điện thoại</span>
                  <span className="font-semibold text-slate-800 text-[11px]">{currentUser.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold text-[9px] uppercase">Phương thức đăng nhập</span>
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {currentUser.isGoogleUser ? 'Liên kết Google' : 'Mật khẩu hệ thống'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold text-[9px] uppercase">Ngày gia nhập</span>
                  <span className="font-semibold text-slate-800 text-[11px]">Tháng 6, 2026</span>
                </div>
              </div>
            </div>

            {/* Quick alert helper */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-1 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Bảo mật dữ liệu cá nhân</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Mọi thông tin liên lạc và phản ánh của bạn đều được mã hóa một chiều và chỉ sử dụng cho mục đích kiểm chứng phòng chống lừa đảo. Danh tính người báo cáo luôn được bảo vệ tuyệt mật.
              </p>
            </div>
          </div>

          {/* COUNTERS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-100/50 p-3 rounded-2xl text-center shadow-xs">
              <span className="block text-xl font-black text-blue-900">{myReports.length}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Đã báo cáo</span>
            </div>
            <div className="bg-white border border-slate-100/50 p-3 rounded-2xl text-center shadow-xs">
              <span className="block text-xl font-black text-emerald-600">
                {myReports.filter(r => r.status === 'verified').length}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Đã duyệt</span>
            </div>
            <div className="bg-white border border-slate-100/50 p-3 rounded-2xl text-center shadow-xs">
              <span className="block text-xl font-black text-amber-500">
                {myReports.filter(r => r.status === 'pending').length}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Đang chờ</span>
            </div>
          </div>
        </div>

        {/* MAIN: REPORT HISTORY LIST */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100/50 shadow-sm p-6 space-y-6">
            
            {/* Filtering bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-blue-900" />
                  <span>Lịch sử phản ánh vụ việc của bạn</span>
                </h3>
                <p className="text-[11px] text-slate-400">Có {myReports.length} vụ việc được ghi nhận từ thông tin cá nhân của bạn</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-400 transition"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Đang tiếp nhận</option>
                  <option value="verified">Đã xác minh</option>
                  <option value="attention">Đang điều tra</option>
                </select>
              </div>
            </div>

            {/* Search Input inside account list */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo loại lừa đảo, số điện thoại, link lừa đảo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-blue-400 transition"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            {/* REPORT LIST CONTAINER */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl space-y-4">
                  <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700 text-xs sm:text-sm">Không tìm thấy báo cáo nào</h4>
                    <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Không tìm thấy kết quả phù hợp với bộ lọc tìm kiếm hiện tại.' 
                        : 'Bạn chưa gửi bất kỳ hồ sơ phản ánh lừa đảo nào lên hệ thống.'}
                    </p>
                  </div>
                  {!searchTerm && statusFilter === 'all' && (
                    <button
                      onClick={onNavigateToReport}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase py-2.5 px-5 rounded-xl transition duration-300"
                    >
                      Báo cáo ngay
                    </button>
                  )}
                </div>
              ) : (
                filteredReports.map((rep) => {
                  const statusInfo = getStatusStyle(rep.status);
                  const isExpanded = expandedReportId === rep.id;
                  const ticketNum = rep.ticketId || `LCS-${rep.id.replace('rep-', '1920')}`;

                  return (
                    <div 
                      key={rep.id}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition duration-300"
                    >
                      {/* Accordion Trigger Header */}
                      <div 
                        onClick={() => toggleExpand(rep.id)}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 shrink-0">
                              Mã số: {ticketNum}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 shrink-0 ${statusInfo.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="font-extrabold text-sm text-slate-800 truncate">{rep.scamType}</h4>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                              <span>Nền tảng: <span className="text-slate-600">{getPlatformLabel(rep.platform)}</span></span>
                              <span>•</span>
                              <span>{rep.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-50 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTicket(ticketNum);
                            }}
                            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100 flex items-center gap-1 text-[10px] font-bold"
                            title="Sao chép mã hồ sơ"
                          >
                            {copiedId === ticketNum ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Đã sao chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Sao chép mã</span>
                              </>
                            )}
                          </button>

                          <div className="text-slate-400 p-1 bg-slate-50 rounded-lg">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanding Accordion Body */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-50 bg-slate-50/50 space-y-4 text-xs animate-slideDown">
                          {/* Main grid fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                            <div className="space-y-1">
                              <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">Đối tượng / Tài khoản lừa đảo</span>
                              <div className="bg-white border border-slate-100 p-2.5 rounded-xl font-mono text-[11px] font-bold text-slate-800 break-all select-all">
                                {rep.targetInfo}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">Địa bàn phản ánh</span>
                              <div className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] font-bold text-slate-700">
                                {rep.location || 'Toàn quốc'}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">Mô tả chi tiết thủ đoạn</span>
                            <p className="bg-white border border-slate-100 p-3 rounded-xl text-slate-600 leading-relaxed text-justify">
                              {rep.description}
                            </p>
                          </div>

                          {/* Screenshot placeholder if exists */}
                          {rep.screenshotUrl && (
                            <div className="space-y-1.5">
                              <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wide">Bằng chứng gửi kèm</span>
                              <div className="inline-block relative rounded-xl overflow-hidden border border-slate-200 bg-white p-1">
                                <img 
                                  src={rep.screenshotUrl} 
                                  alt="Screenshot proof" 
                                  className="max-h-28 object-contain rounded-lg"
                                />
                              </div>
                            </div>
                          )}

                          {/* SYSTEM STATUS TIMELINE / STATUS MESSAGE */}
                          <div className="bg-blue-900 text-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
                            <div className="flex items-center gap-1.5 border-b border-blue-850 pb-2">
                              <BellRing className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                              <h5 className="font-extrabold text-[11px] uppercase tracking-wider text-white">Cập nhật tiến trình xử lý từ Hệ thống</h5>
                            </div>
                            
                            <div className="space-y-2.5">
                              <p className="text-[11px] text-blue-100 leading-relaxed text-justify font-sans">
                                {rep.statusMessage || statusInfo.desc}
                              </p>
                              <div className="text-[10px] text-blue-200/90 font-bold bg-blue-950/40 p-2.5 rounded-lg border border-blue-800/50 flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Đơn vị nghiệp vụ chủ trì: Trung tâm Giám sát an toàn không gian mạng quốc gia (NCSC)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick action guidelines */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4.5 h-4.5 text-blue-700" />
                <span>Quy trình nghiệp vụ kiểm chứng tin báo</span>
              </h4>
              <ul className="space-y-2 text-slate-500 list-disc list-inside leading-relaxed text-justify">
                <li><span className="font-bold text-slate-700">Bước 1 (Tiếp nhận):</span> Ngay khi bạn gửi tin, hệ thống tự động khởi tạo mã hồ sơ LCS và phân loại theo nguồn nền tảng.</li>
                <li><span className="font-bold text-slate-700">Bước 2 (Kiểm chứng):</span> Đội ngũ chuyên gia phối hợp cùng các nhà mạng di động viễn thông, và cơ quan quản lý Internet Việt Nam rà soát thông tin tài khoản ngân hàng thụ hưởng, số điện thoại rác hoặc đường link lừa đảo.</li>
                <li><span className="font-bold text-slate-700">Bước 3 (Ngăn chặn):</span> Các thông tin xác thực lừa đảo sẽ được gỡ bỏ công khai hoặc đồng bộ cập nhật lên ứng dụng bảo mật của các đối tác liên quan.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
