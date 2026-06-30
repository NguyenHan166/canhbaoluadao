/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  Upload, 
  CheckCircle, 
  Info, 
  MapPin, 
  ThumbsUp, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  ShieldAlert,
  Search
} from 'lucide-react';
import { ScamReport } from '../types';
import type { User } from '../types';

interface ReportFormProps {
  reports: ScamReport[];
  onSubmitReport: (report: Omit<ScamReport, 'id' | 'createdAt' | 'status' | 'likesCount' | 'commentsCount'>) => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

export default function ReportForm({ reports, onSubmitReport, fontSize, currentUser, onOpenLogin }: ReportFormProps) {
  // Form States
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [scamType, setScamType] = useState('Giả mạo cơ quan chức năng');
  const [platform, setPlatform] = useState<'facebook' | 'zalo' | 'sms' | 'call' | 'email' | 'website' | 'tmdt' | 'other'>('call');
  const [targetInfo, setTargetInfo] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Auto-populate or clear fields based on user session
  useEffect(() => {
    if (currentUser) {
      setReporterName(currentUser.name);
      setReporterContact(currentUser.phone || currentUser.email);
    } else {
      setReporterName('');
      setReporterContact('');
    }
  }, [currentUser]);

  // UI States
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scam categories
  const scamCategories = [
    'Giả mạo cơ quan Công an',
    'Tuyển CTV xử lý đơn hàng Shopee/Lazada',
    'Giả mạo Shipper giao hàng COD',
    'Lừa đảo Đầu tư tài chính sinh lời',
    'Hack tài khoản Zalo/Facebook mượn tiền',
    'Cuộc gọi khóa sim / phạt nguội',
    'Trúng thưởng giả mạo qua mạng',
    'Hình thức lừa đảo khác'
  ];

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;

    // Call the parent state submit callback
    onSubmitReport({
      reporterName: reporterName || 'Ẩn danh',
      reporterContact,
      scamType,
      platform,
      targetInfo,
      description,
      location: location || 'Cộng đồng',
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=400&q=80'
    });

    const ticketId = 'LCS-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedTicketId(ticketId);
    setSubmitSuccess(true);

    // Reset Form
    setReporterName('');
    setReporterContact('');
    setScamType('Giả mạo cơ quan chức năng');
    setPlatform('call');
    setTargetInfo('');
    setDescription('');
    setLocation('');
    setScreenshotUrl('');
    setUploadedFileName('');
    setIsAgreed(false);

    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPlatformLabel = (p: string) => {
    const labels: Record<string, string> = {
      facebook: 'Facebook',
      zalo: 'Zalo',
      sms: 'SMS',
      call: 'Cuộc gọi di động',
      email: 'Thư điện tử (Email)',
      website: 'Website / Đường link',
      tmdt: 'Sàn thương mại điện tử',
      other: 'Hình thức khác'
    };
    return labels[p] || p;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
            <UserCheck className="w-3 h-3" />
            Đã xác minh lừa đảo
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
            <ShieldAlert className="w-3 h-3" />
            Độ tin cậy cao
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-300">
            <Clock className="w-3 h-3" />
            Đang kiểm duyệt
          </span>
        );
    }
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.scamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetInfo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = filterPlatform === 'all' || r.platform === filterPlatform;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: REPORT SUBMISSION FORM */}
        <div className="lg:col-span-7 space-y-6">
          
          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle className="w-10 h-10 shrink-0" />
                <div>
                  <h3 className="text-lg font-extrabold">Gửi báo cáo thành công!</h3>
                  <p className="text-xs text-emerald-600 font-medium">Mã số hồ sơ phản ánh: <strong className="font-mono">{generatedTicketId}</strong></p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Cảm ơn bạn đã đóng góp thông tin cảnh báo hữu ích cho cộng đồng. Đội ngũ kỹ thuật của <strong>Lá Chắn Số</strong> sẽ khẩn trương kiểm tra tính pháp lý của nguồn tin, xác minh số điện thoại/đường dẫn lừa đảo để đưa vào hệ thống quét cảnh báo sớm quốc gia.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Gửi báo cáo khác
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-red-800 text-white p-6 border-b border-red-900">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-300 animate-bounce" />
                <div>
                  <h2 className="text-xl font-serif font-bold tracking-tight uppercase">TRÌNH BÁO VỤ VIỆC NGHI VẤN LỪA ĐẢO</h2>
                  <p className="text-xs text-red-100 font-medium mt-0.5">Phản ánh thông tin giúp cộng đồng nâng cao ý thức cảnh giác phòng chống tội phạm mạng</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Informative warning alert */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold">Khuyến cáo bảo mật quan trọng:</span> Chỉ cung cấp thông tin liên hệ của kẻ lừa đảo (số điện thoại gọi đến, tài khoản ngân hàng nhận tiền, đường link mạo danh). <strong className="text-red-700">TUYỆT ĐỐI không gửi thông tin quá nhạy cảm</strong> của bản thân như mật khẩu đăng nhập, mã xác minh OTP, mã PIN hay số thẻ đầy đủ để tránh lộ lọt thông tin.
                </div>
              </div>

              {!currentUser && onOpenLogin && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 leading-relaxed">
                      Bạn chưa đăng nhập. Bạn vẫn có thể gửi phản ánh ẩn danh, nhưng nên <span className="font-bold">Đăng nhập ngay</span> để tự động lưu thông tin liên lạc và theo dõi báo cáo.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shrink-0 transition cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}

              {/* Grid 1: Reporter Info (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Họ và tên của bạn (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A (Có thể để trống)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    SĐT hoặc Email liên hệ (Mật khẩu bảo mật)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0912***456 hoặc email@..."
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Thông tin này được bảo mật hoàn toàn, chỉ dùng để đối chiếu khi cần.</p>
                </div>
              </div>

              {/* Grid 2: Scam Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Loại hình lừa đảo
                  </label>
                  <select
                    value={scamType}
                    onChange={(e) => setScamType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600 font-medium"
                  >
                    {scamCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Nền tảng xảy ra
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600 font-medium"
                  >
                    <option value="call">Cuộc gọi thoại di động</option>
                    <option value="facebook">Mạng xã hội Facebook</option>
                    <option value="zalo">Ứng dụng chat Zalo</option>
                    <option value="sms">Tin nhắn SMS (Brandname)</option>
                    <option value="website">Trang web / Đường dẫn lạ</option>
                    <option value="email">Thư điện tử (Email)</option>
                    <option value="tmdt">Mua sắm trực tuyến / Shopee / Lazada</option>
                    <option value="other">Phương thức giao dịch khác</option>
                  </select>
                </div>
              </div>

              {/* Target info */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Số điện thoại lừa đảo / Tài khoản ngân hàng / Địa chỉ link nghi vấn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SĐT 0948.112.334 tự xưng Đại úy Công an, hoặc link http://shopee-nhanthuong.xyz..."
                  value={targetInfo}
                  onChange={(e) => setTargetInfo(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600 font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Mô tả chi tiết nội dung vụ việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả lại kịch bản, các bước kẻ lừa đảo tiếp cận bạn, yêu cầu chuyển khoản ra sao, thái độ hối thúc thế nào..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600 leading-relaxed"
                />
              </div>

              {/* Local and drag/drop upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Địa phương / Tỉnh thành (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Ảnh chụp bằng chứng / Tin nhắn (Tùy chọn)
                  </label>
                  
                  {/* DRAG AND DROP ZONE */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[80px] ${
                      isDragActive 
                        ? 'border-red-500 bg-red-50/50' 
                        : uploadedFileName 
                          ? 'border-emerald-400 bg-emerald-50' 
                          : 'border-slate-300 hover:border-red-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {uploadedFileName ? (
                      <div className="text-xs">
                        <p className="text-emerald-700 font-bold">✓ Đã tải tệp ảnh:</p>
                        <p className="text-slate-600 truncate max-w-[200px] font-mono">{uploadedFileName}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <p className="text-[11px] font-semibold text-slate-600">Thả ảnh hoặc click để chọn</p>
                        <p className="text-[9px] text-slate-400">Hỗ trợ JPG, PNG, GIF</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-slate-300 text-red-600 focus:ring-red-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="agree-checkbox" className="text-xs text-slate-600 leading-normal cursor-pointer select-none">
                  Tôi cam kết thông tin phản ánh trên là đúng sự thật và tự chịu trách nhiệm về tính pháp lý của nội dung do mình gửi lên hệ thống kiểm duyệt Lá Chắn Số.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!isAgreed}
                className="w-full bg-red-700 hover:bg-red-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold py-3 rounded-lg text-sm tracking-wider uppercase transition shadow-xs"
              >
                Gửi phản ánh an toàn
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT REPORTS FROM THE COMMUNITY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold tracking-tight text-sm uppercase">Phản ánh từ cộng đồng</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Dưới đây là các tin báo do người dân cung cấp đã được đội ngũ Lá Chắn Số ghi nhận, xác minh mức độ tin cậy để đưa lên cổng cảnh báo kịp thời.
            </p>

            {/* Filter and Search inside reports list */}
            <div className="space-y-2 pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Lọc tin báo (ví dụ: ctv, công an...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-yellow-400 font-medium"
                />
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              </div>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Phương thức:</span>
                <button
                  onClick={() => setFilterPlatform('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${filterPlatform === 'all' ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterPlatform('call')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${filterPlatform === 'call' ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Cuộc gọi
                </button>
                <button
                  onClick={() => setFilterPlatform('facebook')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${filterPlatform === 'facebook' ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Facebook
                </button>
                <button
                  onClick={() => setFilterPlatform('website')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${filterPlatform === 'website' ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Web rác
                </button>
              </div>
            </div>
          </div>

          {/* REPORTS FEED LIST */}
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
            {filteredReports.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs font-semibold">
                Không tìm thấy phản ánh nào khớp với từ khóa lọc của bạn.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition p-4 space-y-3"
                >
                  {/* Top Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{report.reporterName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {report.createdAt}</span>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Scam details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="bg-red-50 text-red-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border border-red-100">
                        {report.scamType}
                      </span>
                      <span className="text-slate-500 font-semibold">
                        nền tảng {getPlatformLabel(report.platform)}
                      </span>
                    </div>

                    <p className="text-xs font-bold font-mono text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 break-all">
                      <span className="text-red-700 font-sans font-extrabold pr-1">Đối tượng:</span>
                      {report.targetInfo}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {report.description}
                    </p>
                  </div>

                  {/* Location & Interaction Buttons */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {report.location}
                    </span>

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-900 transition font-bold cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Hữu ích ({report.likesCount})</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-900 transition font-bold cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Bình luận ({report.commentsCount})</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
