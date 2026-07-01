import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Table, Quote, Minus, Eye, Save, Maximize2, Minimize2,
  Heading1, Heading2, Heading3, List, ListOrdered, AlertTriangle, HelpCircle, BookOpen,
  ArrowLeft, Check, Sparkles, FileText, CheckSquare, RefreshCw, X, Calendar, Globe, Star,
  Undo2, Redo2, IndentIncrease, IndentDecrease, RemoveFormatting, Subscript, Superscript,
  Type, Palette, Highlighter, Pilcrow, TableIcon, Copy, Scissors, ClipboardPaste
} from 'lucide-react';
import { Article, Category } from '../types';
import MediaLibrary from './MediaLibrary';

interface ArticleEditorProps {
  articleToEdit?: Article | null;
  onSave: (article: Article) => void;
  onCancel: () => void;
  categories: { id: Category; label: string; color: string }[];
  newsSources: { id: string; name: string }[];
}

export default function ArticleEditor({ 
  articleToEdit, 
  onSave, 
  onCancel, 
  categories, 
  newsSources 
}: ArticleEditorProps) {
  
  // Base fields
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [slug, setSlug] = useState(articleToEdit?.slug || '');
  const [summary, setSummary] = useState(articleToEdit?.summary || '');
  const [category, setCategory] = useState<Category>(articleToEdit?.category || 'canh-bao-lua-dao');
  const [author, setAuthor] = useState(articleToEdit?.author || 'Nguyễn Văn Hân');
  const [warningLevel, setWarningLevel] = useState<'low' | 'medium' | 'high' | 'critical'>(articleToEdit?.warningLevel || 'low');
  const [sourceName, setSourceName] = useState(articleToEdit?.sourceName || '');
  const [sourceUrl, setSourceUrl] = useState(articleToEdit?.sourceUrl || '');
  const [thumbnail, setThumbnail] = useState(articleToEdit?.thumbnail || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80');
  
  // Custom structured content blocks
  const [quickSummaryPoints, setQuickSummaryPoints] = useState<string[]>(articleToEdit?.quickSummaryPoints || ['']);
  const [tactics, setTactics] = useState<string[]>(articleToEdit?.tactics || ['']);
  const [signs, setSigns] = useState<string[]>(articleToEdit?.signs || ['']);
  const [prevention, setPrevention] = useState<string[]>(articleToEdit?.prevention || ['']);
  const [whatToDoIfScammed, setWhatToDoIfScammed] = useState<string[]>(articleToEdit?.whatToDoIfScammed || ['']);
  
  // HTML rich text content
  const [htmlContent, setHtmlContent] = useState(articleToEdit?.content || '<p>Nhập nội dung bài viết soạn thảo tại đây...</p>');
  
  // Extra settings
  const [tags, setTags] = useState<string>('an toàn số, lừa đảo, cảnh báo');
  const [status, setStatus] = useState<'draft' | 'pending' | 'published' | 'hidden'>(articleToEdit?.status || 'published');
  const [publishDate, setPublishDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showOnHome, setShowOnHome] = useState(true);
  const [isHero, setIsHero] = useState(articleToEdit?.isHero || false);
  const [isSubHero, setIsSubHero] = useState(articleToEdit?.isSubHero || false);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  
  // Media Modal inside editor
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'thumbnail' | 'editor'>('editor');

  // Ref to content editable div
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!articleToEdit && title) {
      const computedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove tone marks
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(computedSlug);
    }
  }, [title, articleToEdit]);

  // Populate editor content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, []);

  // Simulate auto-saving to Drafts
  useEffect(() => {
    const interval = setInterval(() => {
      if (title.trim()) {
        setSaveStatus('saving');
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSavedTime(new Date().toLocaleTimeString('vi-VN'));
        }, 1000);
      }
    }, 20000); // every 20 seconds if title exists

    return () => clearInterval(interval);
  }, [title, summary]);

  // Font size and color state
  const [currentFontSize, setCurrentFontSize] = useState('3');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // Standard commands for WYSIWYG Editor
  const execCommand = (command: string, value: string = '') => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setSaveStatus('unsaved');
    }
  };

  // Paste handler - prevents icons/emoji from creating new block elements
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;

    // Check if there's HTML content
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    if (html) {
      // Clean HTML: replace block elements wrapping inline content with spans
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Remove Microsoft Word / Google Docs wrapper junk
      tempDiv.querySelectorAll('meta, style, link, title, xml').forEach(el => el.remove());

      // Get cleaned HTML
      const cleanedHtml = tempDiv.innerHTML
        .replace(/<o:p[^>]*>[\s\S]*?<\/o:p>/gi, '')  // Remove Word artifacts
        .replace(/class="[^"]*"/gi, '')  // Remove classes
        .replace(/style="[^"]*mso-[^"]*"/gi, '');  // Remove MS Office styles

      document.execCommand('insertHTML', false, cleanedHtml);
    } else if (text) {
      // Plain text - insert inline without creating blocks
      document.execCommand('insertText', false, text);
    }

    if (editorRef.current) {
      setSaveStatus('unsaved');
    }
  }, []);

  // Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y, etc.)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); execCommand('bold'); break;
        case 'i': e.preventDefault(); execCommand('italic'); break;
        case 'u': e.preventDefault(); execCommand('underline'); break;
        case 'z': e.preventDefault(); execCommand(e.shiftKey ? 'redo' : 'undo'); break;
        case 'y': e.preventDefault(); execCommand('redo'); break;
        case 'l': e.preventDefault(); execCommand('justifyLeft'); break;
        case 'e': e.preventDefault(); execCommand('justifyCenter'); break;
        case 'j': e.preventDefault(); execCommand('justifyFull'); break;
        case 'r': e.preventDefault(); execCommand('justifyRight'); break;
      }
    }
    // Tab = indent, Shift+Tab = outdent
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand(e.shiftKey ? 'outdent' : 'indent');
    }
  }, []);

  // Insert a table
  const insertTable = (rows: number, cols: number) => {
    let tableHtml = '<table style="border-collapse:collapse;width:100%;margin:12px 0" border="1" cellpadding="6" cellspacing="0"><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        const tag = r === 0 ? 'th' : 'td';
        tableHtml += `<${tag} style="border:1px solid #cbd5e1;padding:8px;text-align:left;${r === 0 ? 'background:#f1f5f9;font-weight:bold;' : ''}">${r === 0 ? `Cột ${c + 1}` : '&nbsp;'}</${tag}>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p>&nbsp;</p>';

    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, tableHtml);
      setSaveStatus('unsaved');
    }
  };

  // Color palettes
  const textColors = ['#000000','#434343','#666666','#999999','#b7b7b7','#cccccc','#d9d9d9','#efefef','#f3f3f3','#ffffff',
    '#980000','#ff0000','#ff9900','#ffff00','#00ff00','#00ffff','#4a86e8','#0000ff','#9900ff','#ff00ff',
    '#e6b8af','#f4cccc','#fce5cd','#fff2cc','#d9ead3','#d0e0e3','#c9daf8','#cfe2f3','#d9d2e9','#ead1dc',
    '#dd7e6b','#ea9999','#f9cb9c','#ffe599','#b6d7a8','#a2c4c9','#a4c2f4','#9fc5e8','#b4a7d6','#d5a6bd',
    '#cc4125','#e06666','#f6b26b','#ffd966','#93c47d','#76a5af','#6d9eeb','#6fa8dc','#8e7cc3','#c27ba0'];

  // Custom warning box insert helpers
  const insertCustomBlock = (type: 'warning' | 'note' | 'tip') => {
    let blockHtml = '';
    if (type === 'warning') {
      blockHtml = `
        <div class="my-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl text-red-950 font-sans" contenteditable="true">
          <p class="font-extrabold flex items-center gap-1.5 text-red-800 text-sm mb-1 uppercase tracking-wide">⚠️ CẢNH BÁO KHẨN CẤP</p>
          <p class="text-xs">Nhập nội dung cảnh báo quan trọng tại đây để người dân nâng cao ý thức cảnh giác...</p>
        </div><p>&nbsp;</p>
      `;
    } else if (type === 'note') {
      blockHtml = `
        <div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-950 font-sans" contenteditable="true">
          <p class="font-bold flex items-center gap-1.5 text-amber-800 text-sm mb-1 uppercase tracking-wide">💡 LƯU Ý QUAN TRỌNG</p>
          <p class="text-xs">Người biên tập lưu ý các điểm mấu chốt tại đây...</p>
        </div><p>&nbsp;</p>
      `;
    } else {
      blockHtml = `
        <div class="my-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-950 font-sans" contenteditable="true">
          <p class="font-bold flex items-center gap-1.5 text-emerald-800 text-sm mb-1 uppercase tracking-wide">🛡️ PHÒNG TRÁNH NHANH</p>
          <p class="text-xs">Cách giải quyết nhanh hoặc số điện thoại đường dây nóng hỗ trợ khẩn cấp...</p>
        </div><p>&nbsp;</p>
      `;
    }
    
    // Insert HTML at cursor
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement('div');
        el.innerHTML = blockHtml;
        const frag = document.createDocumentFragment();
        let node;
        while ((node = el.firstChild)) {
          frag.appendChild(node);
        }
        range.insertNode(frag);
      } else {
        editorRef.current.innerHTML += blockHtml;
      }
      setSaveStatus('unsaved');
    }
  };

  // Flow when selected image from Media Library modal
  const handleSelectMediaImage = (url: string, altText?: string) => {
    setShowMediaModal(false);
    if (mediaTarget === 'thumbnail') {
      setThumbnail(url);
    } else {
      // Insert image inside Editor body
      const imageHtml = `
        <div class="my-4 text-center max-w-full font-sans" contenteditable="false">
          <img src="${url}" alt="${altText || 'hình ảnh'}" class="max-h-[350px] mx-auto object-cover rounded-xl shadow-md border border-slate-100" referrerPolicy="no-referrer" />
          <p class="text-[11px] italic text-slate-500 mt-2" contenteditable="true">${altText || 'Chú thích ảnh...'}</p>
        </div><p>&nbsp;</p>
      `;
      if (editorRef.current) {
        editorRef.current.focus();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const el = document.createElement('div');
          el.innerHTML = imageHtml;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = el.firstChild)) {
            frag.appendChild(node);
          }
          range.insertNode(frag);
        } else {
          editorRef.current.innerHTML += imageHtml;
        }
        setSaveStatus('unsaved');
      }
    }
  };

  // Structured fields dynamic modifiers
  const handleUpdateListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, val: string) => {
    const updated = [...list];
    updated[index] = val;
    setList(updated);
    setSaveStatus('unsaved');
  };

  const handleAddListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList([...list, '']);
    setSaveStatus('unsaved');
  };

  const handleRemoveListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
      setSaveStatus('unsaved');
    }
  };

  // Compile final Article model and send to parent
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng điền tiêu đề bài viết.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    const finalHtml = editorRef.current ? editorRef.current.innerHTML : htmlContent;

    const compiledArticle: Article = {
      id: articleToEdit?.id || `art-comp-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      category,
      categoryLabel: categories.find(c => c.id === category)?.label || 'Tin tức',
      thumbnail,
      author: author.trim() || 'Nguyễn Văn Hân',
      date: new Date(publishDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: `${Math.max(2, Math.ceil((finalHtml.split(' ').length + summary.split(' ').length) / 180))} phút đọc`,
      views: articleToEdit?.views || Math.floor(Math.random() * 50) + 10,
      isHero,
      isSubHero,
      warningLevel,
      status,
      sourceName: sourceName.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      quickSummaryPoints: quickSummaryPoints.filter(p => p.trim() !== ''),
      tactics: tactics.filter(p => p.trim() !== ''),
      signs: signs.filter(p => p.trim() !== ''),
      prevention: prevention.filter(p => p.trim() !== ''),
      whatToDoIfScammed: whatToDoIfScammed.filter(p => p.trim() !== ''),
      content: finalHtml
    };

    setTimeout(() => {
      onSave(compiledArticle);
      setIsSaving(false);
      setSaveStatus('saved');
    }, 800);
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 bg-slate-50 z-50 overflow-y-auto p-6' : ''}`}>
      
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-950 uppercase tracking-wider">
              {articleToEdit ? 'Chỉnh sửa bài viết' : 'Viết bài cảnh báo mới'}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
              <span>Hệ thống: Lá Chắn Số CMS</span>
              <span>•</span>
              <span className={`flex items-center gap-1 ${
                saveStatus === 'saved' ? 'text-emerald-600' : saveStatus === 'saving' ? 'text-amber-500' : 'text-slate-400'
              }`}>
                {saveStatus === 'saved' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã lưu tự động {lastSavedTime && `lúc ${lastSavedTime}`}</span>
                  </>
                ) : saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Đang lưu bản nháp...</span>
                  </>
                ) : (
                  <span>Có thay đổi chưa lưu</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              if (!showPreview && editorRef.current) {
                setHtmlContent(editorRef.current.innerHTML);
              }
              setShowPreview(!showPreview);
            }}
            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? 'Chỉnh sửa' : 'Xem trước'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition hidden md:flex items-center gap-1.5 shadow-sm"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleFormSubmit}
            disabled={isSaving}
            className="px-4 py-1.5 bg-blue-900 hover:bg-blue-850 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xuất bản...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Xuất bản ngay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* LIVE ARTICLE PREVIEW ROUTE */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                {categories.find(c => c.id === category)?.label || 'Cảnh báo'}
              </span>
              <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                warningLevel === 'critical' ? 'bg-red-100 text-red-700 animate-pulse' :
                warningLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                warningLevel === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                Cảnh báo: {warningLevel === 'critical' ? 'Khẩn cấp' : warningLevel === 'high' ? 'Nguy hiểm' : warningLevel === 'medium' ? 'Cần chú ý' : 'Bình thường'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {title || 'Tiêu đề bài viết dự thảo'}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold border-b border-slate-100 pb-4">
              <span>Đăng bởi: {author}</span>
              <span>•</span>
              <span>{new Date(publishDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed text-justify border-l-4 border-blue-900 pl-4 bg-slate-50 py-3 rounded-r-xl">
            {summary || 'Mô tả tóm tắt của bài viết sẽ xuất hiện ở đây...'}
          </p>

          <img 
            src={thumbnail} 
            alt="Đại diện" 
            className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-sm border"
            referrerPolicy="no-referrer"
          />

          {/* Render structured blocks in preview */}
          {quickSummaryPoints.some(p => p.trim()) && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Tóm tắt nhanh thủ đoạn
              </h4>
              <ul className="list-disc pl-5 text-xs text-amber-950 space-y-1">
                {quickSummaryPoints.filter(p => p.trim()).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {/* Main content body inside editor view */}
          <div 
            className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Interactive scam specific blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {tactics.some(p => p.trim()) && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-slate-500" />
                  Kịch bản / Thủ đoạn lừa đảo
                </h4>
                <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1">
                  {tactics.filter(p => p.trim()).map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </div>
            )}

            {prevention.some(p => p.trim()) && (
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  Biện pháp phòng tránh an toàn
                </h4>
                <ul className="list-disc pl-5 text-xs text-emerald-950 space-y-1">
                  {prevention.filter(p => p.trim()).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
          </div>

          {sourceName && (
            <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 text-xs text-slate-500 flex justify-between items-center">
              <span>Nguồn tham khảo chính thống: <strong className="text-slate-700">{sourceName}</strong></span>
              {sourceUrl && <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-blue-800 font-bold hover:underline">Xem tin gốc</a>}
            </div>
          )}
        </div>
      ) : (
        /* SOẠN THẢO BÀI VIẾT WORKSPACE */
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main write column */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
            {/* Title field */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tiêu đề bài viết</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveStatus('unsaved');
                }}
                placeholder="Nhập tiêu đề cảnh báo/tin tức bảo mật mạng tại đây..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-700 bg-slate-50/50"
                required
              />
            </div>

            {/* Slug and short summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Slug đường dẫn</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  placeholder="gia-mao-cong-an-vneid"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-700 bg-slate-50/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Chuyên mục chính</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category);
                    setSaveStatus('unsaved');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tóm tắt ngắn (Summary)</label>
              <textarea
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setSaveStatus('unsaved');
                }}
                rows={2}
                placeholder="Nhiều người dân bị chiếm đoạt tài khoản sau cuộc gọi..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-slate-50/20"
              />
            </div>

            {/* WYSIWYG Editor Toolbar - Word mimic */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nội dung chi tiết (Rich Text Editor giống Word)</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50 shadow-xs">
                {/* Tools bar */}
                <div className="p-2.5 border-b border-slate-200 bg-white flex flex-wrap gap-1.5 items-center sticky top-0 z-10 shadow-xs">
                  {/* Undo / Redo */}
                  <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Hoàn tác (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Làm lại (Ctrl+Y)"><Redo2 className="w-4 h-4" /></button>
                  
                  <span className="text-slate-205 mx-1">|</span>

                  {/* Basic styles */}
                  <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 font-bold hover:text-blue-900 transition" title="Bôi đậm (Ctrl+B)"><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 italic hover:text-blue-900 transition" title="In nghiêng (Ctrl+I)"><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 underline hover:text-blue-900 transition" title="Gạch chân (Ctrl+U)"><Underline className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 line-through hover:text-blue-900 transition" title="Gạch ngang"><Strikethrough className="w-4 h-4" /></button>
                  
                  <span className="text-slate-205 mx-1">|</span>

                  {/* Font Size Selector */}
                  <div className="flex items-center gap-1">
                    <Type className="w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={currentFontSize}
                      onChange={(e) => {
                        setCurrentFontSize(e.target.value);
                        execCommand('fontSize', e.target.value);
                      }}
                      className="border border-slate-200 rounded px-1.5 py-0.5 text-xs bg-white text-slate-750 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      title="Kích thước chữ"
                    >
                      <option value="1">10px (Rất nhỏ)</option>
                      <option value="2">12px (Nhỏ)</option>
                      <option value="3">14px (Thường)</option>
                      <option value="4">16px (Trung bình)</option>
                      <option value="5">18px (Hơi lớn)</option>
                      <option value="6">24px (Lớn)</option>
                      <option value="7">32px (Rất lớn)</option>
                    </select>
                  </div>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Text Color Picker */}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => { setShowColorPicker(!showColorPicker); setShowBgColorPicker(false); }}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-750 flex items-center gap-1 hover:text-blue-900 transition"
                      title="Màu chữ"
                    >
                      <Palette className="w-4 h-4 text-rose-600" />
                    </button>
                    {showColorPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl grid grid-cols-10 gap-1 z-50 w-52">
                        {textColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              execCommand('foreColor', color);
                              setShowColorPicker(false);
                            }}
                            className="w-4 h-4 rounded-sm border border-slate-150 transition hover:scale-115"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlight Color Picker */}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowColorPicker(false); }}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-750 flex items-center gap-1 hover:text-blue-900 transition"
                      title="Màu nền chữ (Highlight)"
                    >
                      <Highlighter className="w-4 h-4 text-emerald-600" />
                    </button>
                    {showBgColorPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl grid grid-cols-10 gap-1 z-50 w-52">
                        {textColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              execCommand('hiliteColor', color);
                              setShowBgColorPicker(false);
                            }}
                            className="w-4 h-4 rounded-sm border border-slate-150 transition hover:scale-115"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="button" onClick={() => execCommand('removeFormat')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-rose-600 transition" title="Xóa tất cả định dạng"><RemoveFormatting className="w-4 h-4" /></button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Headers */}
                  <button type="button" onClick={() => execCommand('formatBlock', 'H1')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition font-bold" title="Tiêu đề H1"><Heading1 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition font-bold" title="Tiêu đề H2"><Heading2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('formatBlock', 'H3')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition font-bold" title="Tiêu đề H3"><Heading3 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('formatBlock', 'P')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 text-xs font-black transition hover:text-blue-900" title="Văn bản thường">Paragraph</button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Alignment */}
                  <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Căn trái"><AlignLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Căn giữa"><AlignCenter className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Căn phải"><AlignRight className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Căn đều"><AlignJustify className="w-4 h-4" /></button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Lists & Indents */}
                  <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Danh sách không thứ tự"><List className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Danh sách có thứ tự"><ListOrdered className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('indent')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Thụt dòng lề"><IndentIncrease className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('outdent')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Lùi dòng lề"><IndentDecrease className="w-4 h-4" /></button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Script & Line */}
                  <button type="button" onClick={() => execCommand('subscript')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Chữ dưới"><Subscript className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('superscript')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Chữ trên"><Superscript className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" title="Đường kẻ ngang"><Minus className="w-4 h-4" /></button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Link / Image / Table */}
                  <button 
                    type="button" 
                    onClick={() => {
                      const url = prompt('Nhập địa chỉ liên kết (URL):');
                      if (url) execCommand('createLink', url);
                    }} 
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-900 transition" 
                    title="Chèn liên kết"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setMediaTarget('editor');
                      setShowMediaModal(true);
                    }} 
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 rounded flex items-center gap-1.5 text-[10px] font-black tracking-wide shadow-xs transition" 
                    title="Chèn ảnh từ thư viện"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-700" />
                    <span>ẢNH</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const rows = prompt('Nhập số dòng của bảng:', '3');
                      const cols = prompt('Nhập số cột của bảng:', '3');
                      if (rows && cols) insertTable(parseInt(rows), parseInt(cols));
                    }} 
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-850 rounded flex items-center gap-1.5 text-[10px] font-black tracking-wide shadow-xs transition" 
                    title="Chèn bảng biểu"
                  >
                    <TableIcon className="w-4 h-4 text-slate-700" />
                    <span>BẢNG</span>
                  </button>

                  <span className="text-slate-205 mx-1">|</span>

                  {/* Warning boxes builder tools */}
                  <button type="button" onClick={() => insertCustomBlock('warning')} className="p-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[9px] font-extrabold uppercase px-1.5" title="Khối Cảnh báo đỏ">+ Khối Đỏ</button>
                  <button type="button" onClick={() => insertCustomBlock('note')} className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[9px] font-extrabold uppercase px-1.5 ml-1" title="Khối Chú ý vàng">+ Khối Vàng</button>
                  <button type="button" onClick={() => insertCustomBlock('tip')} className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[9px] font-extrabold uppercase px-1.5 ml-1" title="Khối Mẹo xanh">+ Khối Xanh</button>
                </div>

                {/* Main Editable Box */}
                <div 
                  ref={editorRef}
                  contentEditable
                  onBlur={(e) => {
                    setHtmlContent(e.currentTarget.innerHTML);
                    setSaveStatus('unsaved');
                  }}
                  onInput={() => {
                    setSaveStatus('unsaved');
                  }}
                  onPaste={handlePaste}
                  onKeyDown={handleKeyDown}
                  className="p-6 min-h-[350px] max-h-[600px] overflow-y-auto focus:outline-none bg-white prose max-w-none text-slate-800 text-sm leading-relaxed"
                />

                {/* Footer Count */}
                <div className="bg-slate-50 border-t border-slate-250 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Từ: {htmlContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} từ</span>
                  <span>Ký tự: {htmlContent.length} ký tự</span>
                </div>
              </div>
            </div>

            {/* Special scam alert dynamic block elements */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Các khối thông tin nhanh (Tin Cảnh báo lừa đảo)
                </h3>
              </div>

              {/* Quick Summary Points List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tóm tắt nhanh thủ đoạn (Bullet points)</label>
                  <button type="button" onClick={() => handleAddListItem(quickSummaryPoints, setQuickSummaryPoints)} className="text-[10px] text-blue-900 font-extrabold hover:underline">+ Thêm điểm</button>
                </div>
                <div className="space-y-1.5">
                  {quickSummaryPoints.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateListItem(quickSummaryPoints, setQuickSummaryPoints, index, e.target.value)}
                        placeholder="Ví dụ: Kẻ gian đóng vai công an gọi điện yêu cầu cài app .apk"
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white"
                      />
                      <button type="button" onClick={() => handleRemoveListItem(quickSummaryPoints, setQuickSummaryPoints, index)} className="p-1 hover:text-rose-600 transition text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mẹo / Cách phòng tránh cho người dân</label>
                  <button type="button" onClick={() => handleAddListItem(prevention, setPrevention)} className="text-[10px] text-emerald-700 font-extrabold hover:underline">+ Thêm cách phòng tránh</button>
                </div>
                <div className="space-y-1.5">
                  {prevention.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateListItem(prevention, setPrevention, index, e.target.value)}
                        placeholder="Ví dụ: Không bao giờ cung cấp mã OTP hoặc quyền trợ năng trợ giúp"
                        className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white"
                      />
                      <button type="button" onClick={() => handleRemoveListItem(prevention, setPrevention, index)} className="p-1 hover:text-rose-600 transition text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar settings column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Warning Level & Metadata Block */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2">Thuộc tính bài viết</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Mức độ cảnh báo</label>
                <select
                  value={warningLevel}
                  onChange={(e) => {
                    setWarningLevel(e.target.value as 'low' | 'medium' | 'high' | 'critical');
                    setSaveStatus('unsaved');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white font-bold"
                >
                  <option value="low">🟢 Bình thường</option>
                  <option value="medium">🟡 Cần chú ý</option>
                  <option value="high">🟠 Khẩn cấp (Cao)</option>
                  <option value="critical">🔴 ĐẶC BIỆT NGUY HIỂM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái xuất bản</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as 'draft' | 'pending' | 'published' | 'hidden');
                    setSaveStatus('unsaved');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white font-semibold"
                >
                  <option value="published">Đã xuất bản (Công khai)</option>
                  <option value="draft">Bản nháp (Chưa công khai)</option>
                  <option value="pending">Chờ ban biên tập duyệt</option>
                  <option value="hidden">Ẩn tạm thời</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tác giả / Người biên tập</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hẹn giờ / Ngày đăng</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => {
                      setPublishDate(e.target.value);
                      setSaveStatus('unsaved');
                    }}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Select block */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2">Ảnh đại diện bài viết</h3>
              
              <div className="aspect-video bg-slate-50 border rounded-xl overflow-hidden relative flex items-center justify-center group shadow-inner">
                {thumbnail ? (
                  <>
                    <img src={thumbnail} alt="Đại diện" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget('thumbnail');
                          setShowMediaModal(true);
                        }}
                        className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow transition hover:scale-105"
                      >
                        Thay đổi ảnh đại diện
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('thumbnail');
                        setShowMediaModal(true);
                      }}
                      className="text-xs text-blue-900 font-bold hover:underline"
                    >
                      Chọn ảnh từ Media Library
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hoặc chèn URL trực tiếp</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-blue-700 bg-slate-50/30"
                />
              </div>
            </div>

            {/* Reference Source and original info */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2">Nguồn tin tham khảo</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tên nguồn tin tức</label>
                <select
                  value={sourceName}
                  onChange={(e) => {
                    setSourceName(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 bg-white"
                >
                  <option value="">-- Chọn nguồn tin nhanh --</option>
                  {newsSources.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ bài viết gốc (Link)</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setSaveStatus('unsaved');
                  }}
                  placeholder="https://ais.gov.vn/canh-bao-gia-danh-vneid"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
            </div>

            {/* Tag list & display setup */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b pb-2">Hiển thị website</h3>
              
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-900" />
                    Hiển thị Trang chủ
                  </span>
                  <p className="text-[10px] text-slate-400">Đưa bài viết lên trang chủ</p>
                </div>
                <input
                  type="checkbox"
                  checked={showOnHome}
                  onChange={(e) => {
                    setShowOnHome(e.target.checked);
                    setSaveStatus('unsaved');
                  }}
                  className="h-4 w-4 text-blue-900 focus:ring-blue-500 rounded border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Tin tức Nổi bật chính (Hero)
                  </span>
                  <p className="text-[10px] text-slate-400">Tin đè trang chính, kích thước lớn nhất</p>
                </div>
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => {
                    setIsHero(e.target.checked);
                    if (e.target.checked) setIsSubHero(false);
                    setSaveStatus('unsaved');
                  }}
                  className="h-4 w-4 text-blue-900 focus:ring-blue-500 rounded border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    Tin tức Nổi bật phụ (SubHero)
                  </span>
                  <p className="text-[10px] text-slate-400">Tin phụ cột bên trái trang tin tức</p>
                </div>
                <input
                  type="checkbox"
                  checked={isSubHero}
                  onChange={(e) => {
                    setIsSubHero(e.target.checked);
                    if (e.target.checked) setIsHero(false);
                    setSaveStatus('unsaved');
                  }}
                  className="h-4 w-4 text-blue-900 focus:ring-blue-500 rounded border-slate-200"
                />
              </div>
            </div>

          </div>
        </form>
      )}

      {/* Select Image from Media Library Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-4xl w-full flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                  {mediaTarget === 'thumbnail' ? 'Chọn ảnh đại diện bài viết' : 'Chèn hình ảnh vào văn bản soạn thảo'}
                </h3>
              </div>
              <button 
                onClick={() => setShowMediaModal(false)}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
              <MediaLibrary 
                isSelectMode={true} 
                onSelectImage={handleSelectMediaImage} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
