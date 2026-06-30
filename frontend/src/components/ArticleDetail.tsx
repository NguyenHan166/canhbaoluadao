/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User as UserIcon, 
  Clock, 
  Eye, 
  Share2, 
  FileCheck, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  CornerDownRight,
  BookOpen,
  Copy,
  Check,
  Send,
  MessageSquare,
  Lock,
  ThumbsUp
} from 'lucide-react';
import { Article } from '../types';
import type { User, Comment } from '../types';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onNavigateToArticle: (slug: string) => void;
  onReportSimilar: () => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
}

export default function ArticleDetail({
  article,
  relatedArticles,
  onBack,
  onNavigateToArticle,
  onReportSimilar,
  currentUser,
  onOpenLogin
}: ArticleDetailProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  // Load and save comments for this article slug
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState('');
  const [commentError, setCommentError] = useState('');

  const DEFAULT_COMMENTS_MAP = {
    default: [
      {
        id: 'c1',
        articleSlug: 'all',
        userId: 'mock1',
        userName: 'Hoàng Minh Tuấn',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        content: 'Thủ đoạn tinh vi thật sự! Đọc bài viết này mới thấy mình chưa đủ cảnh giác. Mọi người nên share rộng rãi để người thân, đặc biệt là người già biết cách phòng tránh.',
        createdAt: '3 giờ trước',
        likesCount: 14,
      },
      {
        id: 'c2',
        articleSlug: 'all',
        userId: 'mock2',
        userName: 'Trần Thị Thu Trang',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
        content: 'Trang web rất bổ ích, phân tích đầy đủ các dấu hiệu nhận biết luôn. Cảm ơn ban biên tập Lá Chắn Số!',
        createdAt: '6 giờ trước',
        likesCount: 8,
      }
    ]
  };

  useEffect(() => {
    const key = `lcs_comments_${article.slug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {
        const defaults = DEFAULT_COMMENTS_MAP.default.map(c => ({...c, articleSlug: article.slug}));
        setComments(defaults);
      }
    } else {
      const defaults = DEFAULT_COMMENTS_MAP.default.map(c => ({...c, articleSlug: article.slug}));
      setComments(defaults);
      localStorage.setItem(key, JSON.stringify(defaults));
    }
  }, [article.slug]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(`lcs_comments_${article.slug}`, JSON.stringify(newComments));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenLogin) onOpenLogin();
      return;
    }

    if (!newCommentText.trim()) {
      setCommentError('Nội dung bình luận không được để trống.');
      return;
    }

    if (newCommentText.length > 500) {
      setCommentError('Nội dung bình luận không được vượt quá 500 ký tự.');
      return;
    }

    const newComment: Comment = {
      id: 'cmt_' + Math.random().toString(36).substr(2, 9),
      articleSlug: article.slug,
      userId: currentUser.uid,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userEmail: currentUser.email,
      content: newCommentText.trim(),
      createdAt: 'Vừa xong',
      likesCount: 0
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setNewCommentText('');
    setCommentSuccess('Đã đăng bình luận của bạn thành công!');
    setCommentError('');
    setTimeout(() => setCommentSuccess(''), 2000);
  };

  const handleLikeComment = (cmtId: string) => {
    const likedKey = `lcs_liked_cmt_${cmtId}`;
    if (localStorage.getItem(likedKey)) {
      alert('Bạn đã thích bình luận này rồi!');
      return;
    }

    const updated = comments.map(c => {
      if (c.id === cmtId) {
        return { ...c, likesCount: c.likesCount + 1 };
      }
      return c;
    });
    saveComments(updated);
    localStorage.setItem(likedKey, 'true');
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getWarningLevelBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return (
          <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-1 rounded border border-rose-300 uppercase tracking-wider animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            CẢNH BÁO KHẨN CẤP
          </span>
        );
      case 'high':
        return (
          <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded border border-red-300 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            NGUY CƠ CAO
          </span>
        );
      case 'medium':
        return (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded border border-amber-300 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            TRUNG BÌNH
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-1 rounded border border-blue-300 uppercase tracking-wider flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5" />
            TIN TỨC AN TOÀN
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      
      {/* 1. BACK NAVIGATION */}
      <button 
        onClick={onBack}
        className="mb-6 hover:text-blue-700 text-slate-600 transition flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại trang chủ bản tin
      </button>

      {/* 2. CATEGORY & WARNING LABELS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          {article.categoryLabel}
        </span>
        {getWarningLevelBadge(article.warningLevel)}
      </div>

      {/* 3. HEADLINES */}
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-4">
        {article.title}
      </h1>

      <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6 text-justify border-l-4 border-blue-900 pl-4 bg-slate-50 py-2">
        {article.summary}
      </p>

      {/* 4. METADATA ROW */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-y border-gray-100 py-3 mb-6">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-slate-400" />
          {article.date}
        </span>
        <span className="flex items-center gap-1">
          <UserIcon className="w-4 h-4 text-slate-400" />
          Nguồn: {article.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-slate-400" />
          {article.readTime}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-slate-400" />
          {article.views.toLocaleString()} lượt xem
        </span>
      </div>

      {/* 5. HERO IMAGE */}
      <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
        <img 
          src={article.thumbnail} 
          alt={article.title}
          className="w-full h-[280px] sm:h-[420px] object-cover"
        />
        <p className="text-center text-xs text-slate-400 italic mt-2.5">
          Hình ảnh minh họa tuyên truyền nâng cao ý thức cảnh giác về an toàn thông tin
        </p>
      </div>

      {/* 6. MAIN SECTIONS OF CONTENT */}
      <div className="space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed">
        
        {/* SECTION A: QUICK SUMMARY */}
        {article.quickSummaryPoints && article.quickSummaryPoints.length > 0 && (
          <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
              TÓM TẮT NHANH VỤ VIỆC
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
              {article.quickSummaryPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="bg-rose-100 text-rose-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION B: DETAILED SCENARIO / WHAT IS THE CASE */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-gray-100 pb-1 flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Vụ việc và kịch bản chi tiết:
          </h3>
          <p className="text-justify text-slate-700 text-sm sm:text-[15px]">
            Hiện nay, các thế lực tội phạm sử dụng công nghệ cao đang đẩy mạnh một phương thức lừa đảo tinh vi nhắm vào người dùng Việt Nam. Bằng việc thu thập trái phép thông tin cá nhân bao gồm số căn cước công dân (CCCD), họ tên đầy đủ, cơ quan làm việc, các đối tượng đã xây dựng niềm tin ban đầu cực kỳ vững chắc khiến nạn nhân khó lòng nghi ngờ.
          </p>
        </div>

        {/* SECTION C: TACTICS & BEHAVIOR */}
        {article.tactics && article.tactics.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base uppercase tracking-wide">
              Thủ đoạn chi tiết của kẻ gian:
            </h4>
            <ul className="space-y-2">
              {article.tactics.map((tac, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                  <CornerDownRight className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                  <span>{tac}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION D: SIGNS OF SCAMS */}
        {article.signs && article.signs.length > 0 && (
          <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-amber-900 text-sm sm:text-base uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
              Dấu hiệu nhận diện lừa đảo:
            </h4>
            <ul className="list-disc pl-4 space-y-2 text-slate-700 text-sm">
              {article.signs.map((sig, idx) => (
                <li key={idx} className="leading-relaxed">{sig}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION E: HOW TO PREVENT */}
        {article.prevention && article.prevention.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base uppercase tracking-wide border-l-4 border-blue-900 pl-3">
              Biện pháp chủ động phòng ngừa:
            </h4>
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-gray-100">
              {article.prevention.map((prev, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                  <span className="text-emerald-600 font-extrabold mt-0.5">✓</span>
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIGH-SECURITY CALLOUT BOX */}
        <div className="bg-rose-700 text-white p-5 rounded-2xl shadow-xs space-y-2">
          <span className="font-extrabold text-xs tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded">QUY TẮC PHÒNG VỆ SINH MẠNG SỐ</span>
          <p className="font-bold text-sm sm:text-base">
            "Tuyệt đối KHÔNG cung cấp mã OTP, mật khẩu, mã xác minh, liên kết ngân hàng hoặc thông tin thẻ tín dụng của bạn cho bất kỳ ai, dưới bất kỳ hình thức nào - Kể cả khi đối phương tự xưng là cán bộ Công an, tòa án, nhân viên ngân hàng."
          </p>
        </div>

        {/* SECTION F: WHAT TO DO IF SCAMMED */}
        {article.whatToDoIfScammed && article.whatToDoIfScammed.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-rose-700 text-sm sm:text-base uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
              Nếu đã lỡ làm theo hướng dẫn của chúng thì cần xử lý gì?
            </h4>
            <div className="space-y-3">
              {article.whatToDoIfScammed.map((step, idx) => (
                <div key={idx} className="flex gap-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                  <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700 text-xs sm:text-sm font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOURCE CITATION BLOCK */}
        {article.sourceName && (
          <div className="text-xs text-slate-400 italic pt-4 border-t border-gray-100 flex items-center gap-1 flex-wrap">
            <span>Bài viết tham khảo nguồn chính thống tại:</span>
            {article.sourceUrl ? (
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline font-bold"
              >
                {article.sourceName} &rarr;
              </a>
            ) : (
              <span className="font-semibold">{article.sourceName}</span>
            )}
          </div>
        )}

      </div>

      {/* 7. SHARE & EMERGENCIES CTA ACTIONS */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Share Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            Chia sẻ bài viết:
          </span>
          <button 
            onClick={handleCopyLink}
            className="p-2 border border-gray-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-500 transition flex items-center gap-1 text-xs font-bold"
            title="Sao chép liên kết"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép Link</span>
              </>
            )}
          </button>
          <button 
            onClick={() => alert('Đã gửi liên kết tuyên truyền bảo vệ tài khoản qua mạng xã hội')}
            className="p-2 border border-gray-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-slate-500 transition flex items-center gap-1 text-xs font-bold"
          >
            <Send className="w-3.5 h-3.5 text-teal-600" />
            <span>Gửi Zalo / SMS</span>
          </button>
        </div>

        {/* CTA REPORT */}
        <button
          onClick={onReportSimilar}
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-1.5"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          Tôi đã bị trường hợp tương tự - Trình báo ngay
        </button>

      </div>

      {/* 7.5. COMMUNITY COMMENTS FEED (NEWLY REQUESTED) */}
      <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-900" />
            <h3 className="font-serif font-bold text-base text-slate-900 tracking-tight">
              Ý kiến bạn đọc ({comments.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Ý kiến mang tính xây dựng, văn minh
          </span>
        </div>

        {/* Post Comment Input */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
            <img 
              src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`} 
              alt="User avatar" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Thành viên</span>
              </div>
              
              <textarea
                rows={3}
                required
                placeholder="Hãy chia sẻ nhận định, trải nghiệm của bạn về thủ đoạn này để giúp cộng đồng phòng tránh..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 leading-relaxed"
              />

              {commentError && (
                <p className="text-[11px] text-red-600 font-medium">{commentError}</p>
              )}

              {commentSuccess && (
                <p className="text-[11px] text-emerald-600 font-medium">{commentSuccess}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 border-dashed text-center space-y-3">
            <Lock className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">Bạn chưa đăng nhập hệ thống Lá Chắn Số</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-normal">
                Vui lòng đăng ký hoặc đăng nhập tài khoản thành viên để tham gia thảo luận, chia sẻ kinh nghiệm cảnh giác phòng chống lừa đảo mạng.
              </p>
            </div>
            {onOpenLogin && (
              <button
                type="button"
                onClick={onOpenLogin}
                className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2 rounded-lg transition shadow-sm cursor-pointer"
              >
                Đăng nhập hoặc Đăng ký ngay
              </button>
            )}
          </div>
        )}

        {/* Comments Feed List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-xs text-center text-slate-400 font-semibold py-4">Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên đóng góp ý kiến!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <img 
                  src={comment.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userName)}`} 
                  alt="Comment user avatar" 
                  className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{comment.userName}</span>
                      {comment.userId.startsWith('mock') ? (
                        <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded">Độc giả</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded">Xác minh</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{comment.createdAt}</span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed text-justify">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 hover:text-blue-900 transition font-bold cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Hữu ích ({comment.likesCount})</span>
                    </button>
                    <span className="text-slate-200">|</span>
                    <span className="text-[10px]">Đã duyệt an toàn</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 8. RELATED READINGS / READ MORE */}
      <div className="mt-12 space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 border-b-2 border-blue-700 pb-1.5 uppercase tracking-wide flex items-center gap-1.5">
          <BookOpen className="w-4.5 h-4.5 text-blue-700" />
          Bài viết cảnh báo liên quan:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedArticles.map((rel) => (
            <div 
              key={rel.id}
              onClick={() => onNavigateToArticle(rel.slug)}
              className="border border-gray-200 rounded-xl p-4 flex gap-3 hover:shadow-md hover:border-blue-300 transition cursor-pointer bg-white"
            >
              <img 
                src={rel.thumbnail} 
                alt={rel.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase">{rel.categoryLabel}</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-700 transition leading-snug">
                  {rel.title}
                </h4>
                <p className="text-[11px] text-slate-400">{rel.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
