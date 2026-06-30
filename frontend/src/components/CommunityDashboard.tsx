/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  AlertOctagon, 
  ShieldCheck, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Award
} from 'lucide-react';
import { SCAM_STATISTICS } from '../data/articles';

interface DashboardProps {
  fontSize?: 'normal' | 'large' | 'xlarge';
}

export default function CommunityDashboard({ fontSize }: DashboardProps) {
  // Mini Scam Radar Game State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const quizQuestions = [
    {
      question: 'Bạn nhận được cuộc gọi từ số di động tự xưng là Cảnh sát giao thông báo phạt nguội 5 triệu đồng, yêu cầu chuyển khoản ngay để giải quyết. Bạn làm gì?',
      options: [
        'Lo sợ nộp phạt ngay lập tức để tránh rắc rối pháp lý.',
        'Hỏi thông tin tên cơ quan công an, chủ động cúp máy và tự đi xác minh với công an địa phương hoặc tra cứu trên trang phạt nguội quốc gia chính thức.',
        'Cung cấp mật khẩu ngân hàng và mã OTP để họ trừ tiền tự động.'
      ],
      correctIndex: 1,
      explanation: 'Cơ quan Công an, CSGT TUYỆT ĐỐI không bao giờ làm việc xử phạt hành chính qua điện thoại hay yêu cầu người dân chuyển khoản trực tiếp vào tài khoản cá nhân.'
    },
    {
      question: 'Một người bạn thân thiết nhắn tin qua Facebook Messenger mượn gấp 10 triệu đồng đóng viện phí tai nạn, tài khoản chuyển tiền tên của một người hoàn toàn lạ. Bạn xử lý như thế nào?',
      options: [
        'Tin tưởng chuyển khoản ngay lập tức vì việc gấp cứu người.',
        'Gọi điện thoại trực tiếp bằng sim di động (hoặc gặp mặt) để kiểm tra chéo xem có đúng bạn mình nhắn hay tài khoản Facebook đang bị hack.',
        'Chuyển trước 5 triệu để thăm dò tình hình.'
      ],
      correctIndex: 1,
      explanation: 'Kẻ hack nick thường mượn danh bạn bè nhắn tin mượn tiền gấp và gửi tài khoản trung gian lạ để nhận. Luôn phải gọi điện xác minh bằng số điện thoại di động thông thường.'
    },
    {
      question: 'Bạn thấy đường link gửi qua tin nhắn trúng thưởng xe máy SH 150i trị giá 100 triệu, trang web yêu cầu nhập thông tin ví điện tử Momo hoặc tài khoản ngân hàng để nhận thưởng. Bạn làm thế nào?',
      options: [
        'Tuyệt đối không truy cập, không điền bất cứ thông tin đăng nhập hay mã OTP nào.',
        'Nhập thử tài khoản phụ không có tiền để kiểm tra xem có quà thật hay không.',
        'Đăng nhập tài khoản chính để họ làm thủ tục chuyển thưởng nhanh nhất.'
      ],
      correctIndex: 0,
      explanation: 'Đây là bẫy lừa đảo trúng thưởng mạo danh hòng đánh cắp mật khẩu đăng nhập tài khoản ngân hàng và mã OTP để rút hết số dư ví điện tử của bạn.'
    }
  ];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correctIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans space-y-8">
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition duration-150 flex items-center gap-4">
          <div className="bg-red-50 text-red-700 p-3.5 rounded-lg border border-red-100">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Tin báo tiếp nhận tuần này</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{SCAM_STATISTICS.totalReportsThisWeek}</span>
              <span className="text-xs text-red-600 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Từ cộng đồng 63 tỉnh thành</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition duration-150 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-900 p-3.5 rounded-lg border border-blue-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Vụ việc đã xác thực</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{SCAM_STATISTICS.verifiedScamsCount}</span>
              <span className="text-xs text-blue-800 font-bold flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -3.5%
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Đã cập nhật vào cơ sở dữ liệu đen</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition duration-150 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-900 p-3.5 rounded-lg border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Lượt tra cứu an toàn</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">12,450+</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center text-[10px] bg-emerald-50 px-1 py-0.5 rounded">
                Hoạt động tốt
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Số ĐT & đường dẫn liên kết độc hại</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition duration-150 flex items-center gap-4">
          <div className="bg-amber-50 text-amber-800 p-3.5 rounded-lg border border-amber-200">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Đang theo dõi khẩn cấp</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">03</span>
              <span className="text-xs text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase animate-pulse border border-red-200">
                Nguy cấp
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Chiến dịch lừa đảo đang bùng phát</span>
          </div>
        </div>

      </div>

      {/* 2. MAIN CHARTS & TRENDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top platforms & scam types */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">PHÂN TÍCH THỐNG KÊ CHI TIẾT TUẦN NÀY</h3>
              <p className="text-[11px] text-slate-400">Số liệu cập nhật thời gian thực dựa trên kiểm chứng của Lá Chắn Số</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Targeted Platforms Chart */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
                Nền tảng mục tiêu hàng đầu
              </h4>
              <p className="text-[11px] text-slate-400">Tỷ lệ các vụ lừa đảo phân bổ trên môi trường kỹ thuật số</p>
              
              <div className="space-y-3.5">
                {SCAM_STATISTICS.topTargetPlatforms.map((platform, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium">{platform.name}</span>
                      <span className="text-slate-900 font-bold">{platform.percent}% ({platform.count} vụ)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${platform.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${platform.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Scam Types Trend */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider border-l-2 border-rose-600 pl-2">
                Các hình thức lừa lấn át nhất
              </h4>
              <p className="text-[11px] text-slate-400">Xu hướng hành vi lừa đảo đang chiều hướng gia tăng</p>

              <div className="divide-y divide-gray-100 text-xs">
                {SCAM_STATISTICS.topScamTypes.map((scam, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 font-medium">{scam.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-slate-900">{scam.count} tin báo</span>
                      {scam.trend === 'up' && (
                        <span className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5">
                          Tăng ▲
                        </span>
                      )}
                      {scam.trend === 'stable' && (
                        <span className="text-slate-500 bg-slate-100 px-1 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5">
                          Ổn định ■
                        </span>
                      )}
                      {scam.trend === 'down' && (
                        <span className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5">
                          Giảm ▼
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Province Risk Levels */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">CẢNH BÁO ĐỊA PHƯƠNG</h3>
              <p className="text-[11px] text-slate-400">Chỉ số rủi ro tội phạm mạng theo tỉnh thành</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Mật độ phát hiện các đầu số VoIP rác, cuộc gọi giả mạo cơ quan công tố bùng phát theo từng vùng lãnh thổ. Người dân tại các tỉnh thành báo động cần nâng cao tự vệ:
          </p>

          <div className="space-y-3.5">
            {SCAM_STATISTICS.localTrends.map((trend, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-slate-50/50 text-xs hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-800">{trend.region}</span>
                </div>
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-slate-500">{trend.activeAlerts} chiến dịch</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    trend.riskLevel === 'Cao' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {trend.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs space-y-2">
            <span className="font-bold text-blue-900 block">Bạn phát hiện đầu số lừa đảo mới?</span>
            <p className="text-blue-700 leading-relaxed text-[11px]">
              Gửi ngay phản ánh kèm số điện thoại, tài khoản ngân hàng để hệ thống lập tức cập nhật, ngăn chặn lừa đảo bảo vệ đồng bào tỉnh nhà.
            </p>
          </div>

        </div>

      </div>

      {/* 3. GAME / INTERACTIVE CYBER FRAUD RADAR */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-yellow-400">Tự rèn luyện kỹ năng</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              TRẮC NGHIỆM: RADAR NHẬN DIỆN THỦ ĐOẠN LỪA ĐẢO MẠNG
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Kiểm tra nhanh xem "hệ miễn dịch số" của bạn ở cấp độ nào chỉ với 3 tình huống thực tế kinh điển.
            </p>
          </div>

          {!gameFinished ? (
            <div className="bg-slate-950/45 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-5">
              {/* Question status */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3 text-xs font-semibold text-indigo-200">
                <span>Câu hỏi {currentQuestion + 1} trên {quizQuestions.length}</span>
                <span className="bg-indigo-700 px-2.5 py-1 rounded-full text-[10px]">Cấp độ: Người dùng thông minh</span>
              </div>

              {/* Question title */}
              <h4 className="text-sm sm:text-base font-extrabold leading-snug">
                {quizQuestions[currentQuestion].question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, idx) => {
                  let btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-950/70 hover:text-white transition';
                  
                  if (selectedAnswer !== null) {
                    if (idx === quizQuestions[currentQuestion].correctIndex) {
                      btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-100 font-bold';
                    } else if (idx === selectedAnswer) {
                      btnStyle = 'bg-red-950/50 border-red-500 text-red-100';
                    } else {
                      btnStyle = 'opacity-50 bg-slate-950/40 border-slate-800 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full text-left p-3.5 border rounded-xl text-xs sm:text-sm transition flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="bg-white/15 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation section */}
              {showExplanation && (
                <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Giải thích từ chuyên gia an ninh mạng:</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed text-justify">
                    {quizQuestions[currentQuestion].explanation}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold py-2 px-5 rounded-lg transition ml-auto block"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-6 sm:p-8 text-center space-y-5 animate-fadeIn">
              <div className="bg-amber-400 text-slate-950 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20">
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-extrabold">KẾT QUẢ ĐÁNH GIÁ AN TOÀN SỐ</h4>
                <p className="text-sm text-indigo-100">Bạn trả lời đúng <strong>{score}/{quizQuestions.length}</strong> tình huống cảnh báo.</p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-indigo-900/40 text-xs leading-relaxed text-indigo-100 text-justify">
                {score === quizQuestions.length ? (
                  <span className="font-semibold text-emerald-400">Xuất sắc! Bạn có phản xạ bảo mật cực kỳ hoàn hảo. Bạn hoàn toàn đủ năng lực tự bảo vệ mình và có thể tuyên truyền giúp đỡ cho gia đình, đặc biệt là người cao tuổi trong nhà tránh xa các bẫy lừa đảo mạng.</span>
                ) : score >= 1 ? (
                  <span className="font-semibold text-amber-300">Khá tốt! Bạn đã có những nhận thức cơ bản về an toàn trực tuyến, tuy nhiên kẻ lừa đảo thường biến tướng kịch bản cực kỳ xảo quyệt. Hãy liên tục cập nhật kiến thức trên Lá Chắn Số hằng ngày nhé.</span>
                ) : (
                  <span className="font-semibold text-rose-300">Cảnh báo: Bạn đang ở vùng nguy hiểm rủi ro rất cao trước bẫy tâm lý của kẻ lừa đảo mạng. Vui lòng đọc kỹ chuyên trang "Kiến thức số" và quy tắc an toàn của chúng tôi để bảo vệ tài khoản ngân hàng của bạn.</span>
                )}
              </div>

              <button
                onClick={handleRestartQuiz}
                className="bg-white hover:bg-indigo-50 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition"
              >
                Làm trắc nghiệm lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
