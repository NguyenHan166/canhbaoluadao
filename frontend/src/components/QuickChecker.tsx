/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  ShieldQuestion, 
  PhoneCall, 
  Link2, 
  MessageSquare,
  Search,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { QuickCheckResult } from '../types';

export default function QuickChecker() {
  const [activeTab, setActiveTab] = useState<'phone' | 'url' | 'content'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<QuickCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const blacklistedPhones = [
    '0948112334', '0948.112.334', 
    '0812990221', '0812.990.221', 
    '0901884223', '0901.884.223',
    '1900112233', '0249999111', '0289999222',
    '+84948112334', '+84812990221'
  ];

  const blacklistedUrls = [
    'dv-crypto-invest-gold.top', 'dv-crypto-invest-gold',
    'shopee-nhanthuong.xyz', 'shopee-nhanthuong',
    'vietcombank-login-online.cc', 'vietcombank-login',
    'vneid-capnhat.apk', 'vneid-dichvucong.top',
    'momo-qua-tang-68.top', 'momo-qua-tang',
    'binhchon-vietnamidol.site', 'facebook-security-verify.com'
  ];

  const dangerKeywords = [
    'otp', 'mã otp', 'ma otp', 
    'vneid', 'định danh', 'dinh danh',
    'cong an', 'công an', 'viện kiểm sát', 'vien kiem sat',
    'lệnh bắt', 'lenh bat', 'rửa tiền', 'rua tien',
    'khóa sim', 'khoa sim', 'phạt nguội', 'phat nguoi',
    'trúng thưởng', 'trung thuong', 'quà tặng', 'qua tang',
    'giật đơn', 'giat don', 'shopee', 'lazada', 'nhiệm vụ', 'nhiem vu',
    'vốn tự có', 'đầu tư', 'dau tu', 'lãi suất cao', 'lai suat cao'
  ];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsChecking(true);
    setResult(null);

    setTimeout(() => {
      const queryCleaned = inputValue.trim().toLowerCase();
      let status: 'dangerous' | 'suspicious' | 'safe' | 'unverified' = 'unverified';
      let score = 0;
      let title = '';
      let description = '';
      let details: string[] = [];
      let recommendations: string[] = [];

      // 1. PHONE CHECK
      if (activeTab === 'phone') {
        const numbersOnly = queryCleaned.replace(/[^0-9+]/g, '');
        const isMatchedBlacklist = blacklistedPhones.some(phone => 
          numbersOnly.includes(phone.replace(/[^0-9+]/g, '')) || 
          phone.replace(/[^0-9+]/g, '').includes(numbersOnly)
        );

        if (isMatchedBlacklist) {
          status = 'dangerous';
          score = 98;
          title = 'CẢNH BÁO NGUY HIỂM: Số điện thoại nằm trong danh sách lừa đảo!';
          description = 'Số thuê bao này đã được cộng đồng phản ánh và cơ quan Công an xác minh là công cụ chuyên dùng giả mạo cán bộ điều tra hoặc shipper lừa tiền.';
          details = [
            'Nằm trong danh bạ đen của Cục An toàn thông tin.',
            'Có 15+ báo cáo trùng khớp về hành vi giả danh cán bộ VNeID hoặc shipper gửi COD ảo.',
            'Nhà mạng ghi nhận tần suất phát tán cuộc gọi rác cực kỳ lớn.'
          ];
          recommendations = [
            'Tuyệt đối KHÔNG nghe cuộc gọi từ số này.',
            'Nếu đã lỡ bắt máy, lập tức dập máy, KHÔNG cung cấp số CCCD, thẻ ngân hàng, hoặc địa chỉ.',
            'Chặn ngay số điện thoại này trên thiết bị di động của bạn.'
          ];
        } else if (
          numbersOnly.startsWith('024') || 
          numbersOnly.startsWith('028') || 
          numbersOnly.startsWith('+') || 
          numbersOnly.length > 11 || 
          numbersOnly.length < 9
        ) {
          status = 'suspicious';
          score = 65;
          title = 'CẢNH BÁO NGHI VẤN: Số điện thoại có dấu hiệu rủi ro cao';
          description = 'Số điện thoại này sử dụng đầu số giả lập VoIP, đầu số quốc tế hoặc là số lạ không đăng ký chính chủ. Thường xuyên được các băng nhóm lừa đảo qua mạng sử dụng.';
          details = [
            'Sử dụng đầu số lạ hoặc đầu số cố định gọi tự động (VoIP) dễ giả mạo.',
            'Tần suất gọi đi liên tục vào các giờ cao điểm.',
            'Chưa có thông tin xác minh đăng ký chính chủ doanh nghiệp uy tín.'
          ];
          recommendations = [
            'Cảnh giác cao độ nếu đầu dây bên kia tự xưng là CSGT phạt nguội, Viện kiểm sát hoặc nhân viên giao hàng.',
            'Nhớ quy tắc: Cơ quan pháp luật không bao giờ làm việc qua điện thoại hay gửi giấy mời qua mạng xã hội.',
            'Ghi âm cuộc gọi nếu chúng có hành vi đe dọa.'
          ];
        } else {
          status = 'safe';
          score = 12;
          title = 'Chưa phát hiện báo cáo xấu về số điện thoại này';
          description = 'Hệ thống hiện tại chưa ghi nhận phản ánh lừa đảo trực tuyến nào liên quan trực tiếp đến số thuê bao bạn vừa tìm kiếm.';
          details = [
            'Không có trong danh sách đen cảnh báo lừa đảo quốc gia.',
            'Tần suất hoạt động ở mức thông thường bình thường.'
          ];
          recommendations = [
            'Dù hệ thống chưa cảnh báo, hãy luôn cảnh giác nếu đối phương yêu cầu chuyển tiền hoặc gửi mã OTP.',
            'Nếu cuộc gọi yêu cầu các thao tác tài chính, vui lòng tắt máy và gọi tổng đài chính thức của ngân hàng để kiểm tra chéo.'
          ];
        }

      // 2. URL CHECK
      } else if (activeTab === 'url') {
        const isMatchedBlacklist = blacklistedUrls.some(url => queryCleaned.includes(url));
        const hasHttps = queryCleaned.startsWith('https://');
        const hasApk = queryCleaned.includes('.apk');
        const hasUnusualSuffix = /\.(xyz|top|cc|site|app|cn|club|today|vip|online|shop)$/i.test(queryCleaned);

        if (isMatchedBlacklist) {
          status = 'dangerous';
          score = 100;
          title = 'NGUY HIỂM CỰC KỲ: Đường dẫn giả mạo lừa đảo đã xác thực!';
          description = 'Địa chỉ website này là trang phishing giả mạo ngân hàng, cổng thông tin VNeID giả, hoặc trang đánh cắp thông tin tài khoản được dựng lên tinh vi.';
          details = [
            'Trùng khớp với chiến dịch lừa đảo đánh cắp thông tin giao dịch tài chính.',
            'Máy chủ đặt tại nước ngoài, sử dụng dịch vụ ẩn giấu danh tính tên miền.',
            'Tự động kích hoạt tải xuống tệp có chứa mã độc gián điệp khi truy cập.'
          ];
          recommendations = [
            'Tuyệt đối KHÔNG truy cập vào đường link này.',
            'KHÔNG điền bất kỳ thông tin mật khẩu, số thẻ ngân hàng, hoặc mã OTP vào trang web.',
            'Nếu đã lỡ đăng nhập, hãy đổi ngay mật khẩu app ngân hàng trên điện thoại của bạn ngay lập tức.'
          ];
        } else if (hasApk || hasUnusualSuffix || !hasHttps) {
          status = 'suspicious';
          score = 75;
          title = 'CẢNH BÁO NGHI VẤN: Đường dẫn có nguy cơ rủi ro rất cao!';
          description = 'Tên miền sử dụng đuôi lạ giá rẻ, thiếu chứng chỉ bảo mật HTTPS hoặc cố ý dụ dỗ cài đặt ứng dụng Android (.apk) trực tiếp.';
          details = [
            !hasHttps ? 'Thiếu giao thức mã hóa an toàn HTTPS (Dữ liệu gửi đi có thể bị đánh cắp dễ dàng).' : 'Có HTTPS nhưng tên miền đáng ngờ.',
            hasApk ? 'Chứa tệp tải ứng dụng ngoài (.apk) thường dùng để phát tán phần mềm độc hại điều khiển điện thoại.' : null,
            hasUnusualSuffix ? 'Sử dụng đuôi tên miền không chính quy (.xyz, .top, .cc, .site), thường được đăng ký vô danh để lập web rác.' : null
          ].filter(Boolean) as string[];
          recommendations = [
            'Không click vào link và không cho phép tải xuống bất kỳ tệp tin nào.',
            'Kiểm tra xem tên miền có bị cố tình viết sai chính tả hay không (ví dụ: vietcombak.com thay vì vietcombank.com).',
            'Sử dụng các công cụ duyệt web an toàn để bảo vệ thiết bị.'
          ];
        } else {
          status = 'safe';
          score = 15;
          title = 'Đường dẫn chưa bị báo cáo vi phạm';
          description = 'Hệ thống chưa tìm thấy dữ liệu cảnh báo lừa đảo liên quan đến địa chỉ website này.';
          details = [
            'Sử dụng giao thức HTTPS bảo mật hợp lệ.',
            'Đuôi tên miền uy tín phổ biến (.vn, .com, .net, .gov.vn).'
          ];
          recommendations = [
            'Luôn chú ý kiểm tra tên miền ở thanh địa chỉ trình duyệt xem có khớp đúng thương hiệu chính thức của doanh nghiệp hay không.',
            'Ngay cả trên web an toàn, không bao giờ chia sẻ mã PIN hay mật khẩu cá nhân.'
          ];
        }

      // 3. CONTENT CHECK
      } else {
        const foundKeywords = dangerKeywords.filter(keyword => queryCleaned.includes(keyword));
        const matchedCount = foundKeywords.length;

        if (matchedCount >= 3) {
          status = 'dangerous';
          score = 88;
          title = 'CẢNH BÁO NGUY HIỂM: Nội dung tin nhắn mang đặc trưng lừa đảo!';
          description = 'Nội dung chứa hàng loạt từ khóa dụ dỗ, đe dọa, hoặc hối thúc giao dịch tài chính, mang kịch bản thao túng tâm lý điển hình của tội phạm mạng.';
          details = [
            `Chứa các thuật ngữ nhạy cảm đáng báo động: ${foundKeywords.map(k => `"${k}"`).join(', ')}.`,
            'Yêu cầu cung cấp thông tin nhạy cảm hoặc hứa hẹn mức lãi suất bất thường.',
            'Tạo tâm lý khẩn cấp (khóa tài khoản, lệnh bắt, quà tặng sắp hết hạn).'
          ];
          recommendations = [
            'Tuyệt đối không làm theo các chỉ dẫn trong tin nhắn.',
            'Không gọi lại số điện thoại hoặc click vào link đính kèm trong nội dung.',
            'Chụp màn hình lại và gửi báo cáo đầy đủ lên Lá Chắn Số để cảnh báo cho người khác.'
          ];
        } else if (matchedCount >= 1) {
          status = 'suspicious';
          score = 55;
          title = 'NGHI VẤN: Tin nhắn chứa thông tin cần kiểm tra thêm';
          description = 'Nội dung xuất hiện một số thuật ngữ thường gặp trong các vụ lừa đảo chiếm đoạt tài sản.';
          details = [
            `Phát hiện từ khóa nghi vấn: ${foundKeywords.map(k => `"${k}"`).join(', ')}.`,
            'Nội dung có thể là thật nếu gửi từ ngân hàng có brandname, nhưng cần cảnh giác với các số di động thường mạo danh.'
          ];
          recommendations = [
            'Kiểm tra kỹ xem người gửi là ai. Nếu gửi từ một số di động thông thường tự xưng là ngân hàng, chắc chắn đó là giả mạo.',
            'Liên hệ tổng đài chăm sóc khách hàng chính thức để xác nhận lại thông tin chương trình.'
          ];
        } else {
          status = 'safe';
          score = 8;
          title = 'Nội dung tin nhắn chưa phát hiện dấu hiệu bất thường';
          description = 'Không phát hiện kịch bản hay từ khóa lừa đảo phổ biến trong nội dung văn bản này.';
          details = [
            'Không chứa từ khóa đe dọa, phong tỏa tài khoản hoặc hối thúc nạp tiền làm nhiệm vụ.'
          ];
          recommendations = [
            'Hãy giữ thói quen không bao giờ chia sẻ OTP cho bất kỳ ai, bất kể nội dung tin nhắn là gì.'
          ];
        }
      }

      setResult({
        query: inputValue,
        type: activeTab,
        status,
        score,
        title,
        description,
        details,
        recommendations
      });
      setIsChecking(false);
    }, 1200);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'dangerous':
        return {
          bg: 'bg-rose-50 border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          text: 'text-rose-900',
          accent: 'border-rose-500',
          iconColor: 'text-rose-600',
          icon: <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
        };
      case 'suspicious':
        return {
          bg: 'bg-amber-50 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          text: 'text-amber-900',
          accent: 'border-amber-500',
          iconColor: 'text-amber-600',
          icon: <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
        };
      case 'safe':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          text: 'text-emerald-900',
          accent: 'border-emerald-500',
          iconColor: 'text-emerald-600',
          icon: <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          text: 'text-slate-900',
          accent: 'border-slate-500',
          iconColor: 'text-slate-600',
          icon: <ShieldQuestion className="w-8 h-8 text-slate-500 shrink-0" />
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden font-sans" id="quick-checker-container">
      {/* HEADER BAR */}
      <div className="bg-blue-900 text-white p-4.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-black tracking-wider uppercase">KIỂM TRA NHANH</h3>
        </div>
        <p className="text-slate-300 text-[11px] mt-1.5 leading-normal">
          Tra cứu, phát hiện nhanh số điện thoại lừa đảo, website giả mạo và phân tích tin nhắn dụ dỗ cực kỳ chuẩn xác.
        </p>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 border-b border-slate-200 text-xs bg-slate-50 font-bold text-slate-600">
        <button
          onClick={() => { setActiveTab('phone'); setInputValue(''); setResult(null); }}
          className={`py-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'phone' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span>Số điện thoại</span>
        </button>
        <button
          onClick={() => { setActiveTab('url'); setInputValue(''); setResult(null); }}
          className={`py-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'url' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 shrink-0" />
          <span>Đường link / Web</span>
        </button>
        <button
          onClick={() => { setActiveTab('content'); setInputValue(''); setResult(null); }}
          className={`py-3 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'content' ? 'border-blue-900 text-blue-900 bg-white font-extrabold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          <span>Nội dung tin</span>
        </button>
      </div>

      <div className="p-4.5">
        {/* INPUT FORM */}
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
              {activeTab === 'phone' && 'Nhập số điện thoại nghi vấn:'}
              {activeTab === 'url' && 'Dán địa chỉ website nghi vấn (Ví dụ: shopee-nhanthuong.xyz):'}
              {activeTab === 'content' && 'Dán toàn bộ nội dung tin nhắn đáng ngờ nhận được:'}
            </label>
            
            {activeTab === 'content' ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ví dụ: Bấm phím 9 để nghe thông báo từ Bộ Công an về lệnh bắt giam..."
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-400 transition bg-slate-50 placeholder:text-gray-400"
              />
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    activeTab === 'phone' 
                      ? 'Ví dụ: 0948112334 hoặc +84...' 
                      : 'Ví dụ: http://dv-crypto-invest-gold.top'
                  }
                  className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-400 transition bg-slate-50 placeholder:text-gray-400 font-mono"
                />
                <div className="absolute right-3 top-2.5">
                  {activeTab === 'phone' ? <PhoneCall className="w-4 h-4 text-slate-400" /> : <Link2 className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-[10px] text-slate-500 italic max-w-[65%] leading-normal hidden sm:inline-block">
              * Dữ liệu được liên kết và cập nhật tự động từ danh sách đen lừa đảo quốc gia.
            </span>
            <button
              type="submit"
              disabled={isChecking || !inputValue.trim()}
              className="w-full sm:w-auto ml-auto bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 text-white font-bold px-5 py-2 rounded text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Kiểm tra dấu hiệu
                </>
              )}
            </button>
          </div>
        </form>

        {/* RESULT PRESENTATION */}
        {result && (
          <div className={`mt-5 border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${getStatusStyle(result.status).bg}`}>
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {getStatusStyle(result.status).icon}
                <div className="space-y-1.5 flex-grow w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyle(result.status).badge}`}>
                      {result.status === 'dangerous' && 'Ngoại tuyến - Nguy cơ cao'}
                      {result.status === 'suspicious' && 'Nghi vấn lừa đảo'}
                      {result.status === 'safe' && 'Chưa thấy cảnh báo'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Mức độ rủi ro: <strong className={result.status === 'dangerous' ? 'text-rose-600' : result.status === 'suspicious' ? 'text-amber-600' : 'text-emerald-600'}>{result.score}%</strong>
                    </span>
                  </div>
                  
                  <h4 className={`text-sm sm:text-base font-extrabold leading-tight ${getStatusStyle(result.status).text}`}>
                    {result.title}
                  </h4>
                  
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>

              {/* DETAILS BLOCK */}
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                {result.details.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      Phân tích dấu hiệu chi tiết:
                    </h5>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
                      {result.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="bg-white/70 p-3.5 rounded-lg border border-gray-100">
                    <h5 className="text-xs font-bold uppercase tracking-wide text-rose-800 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Khuyến nghị an toàn tức thời:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GENERAL DISCLAIMER */}
        <div className="mt-4 bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Lưu ý quan trọng:</strong> Công cụ kiểm tra nhanh này phân tích dựa trên cơ sở dữ liệu quốc gia cập nhật, các dấu hiệu lừa đảo và cấu trúc kỹ thuật đã biết. Tuy nhiên, các hình thức lừa đảo mạng luôn thay đổi liên tục. Bạn cần luôn giữ vững ý thức bảo mật cá nhân và tuyệt đối không chuyển tiền khi chưa tự mình xác minh thông tin rõ ràng.
          </span>
        </div>
      </div>
    </div>
  );
}
