import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileText, Image as ImageIcon, FileCode, 
  Search, Upload, Plus, Trash2, Edit3, Copy, Check, Eye, ChevronRight 
} from 'lucide-react';
import { MediaFile, INITIAL_MEDIA_FILES } from './mockData';

interface MediaLibraryProps {
  onSelectImage?: (url: string, altText?: string) => void;
  isSelectMode?: boolean;
}

export default function MediaLibrary({ onSelectImage, isSelectMode = false }: MediaLibraryProps) {
  // Sync Media Files with localStorage to persist uploads/deletes
  const [files, setFiles] = useState<MediaFile[]>(() => {
    const saved = localStorage.getItem('lanchanso_media_files');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lanchanso_media_files', JSON.stringify(INITIAL_MEDIA_FILES));
    return INITIAL_MEDIA_FILES;
  });

  const [currentFolder, setCurrentFolder] = useState<string>('/uploads/articles/2026/06');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Folder hierarchy representation
  const folders = [
    '/uploads',
    '/uploads/articles',
    '/uploads/articles/2026',
    '/uploads/articles/2026/06',
    '/uploads/articles/2026/07',
    '/uploads/scam-alerts',
    '/uploads/banners',
    '/uploads/reports',
    '/uploads/documents'
  ];

  // Helper to save files state
  const saveFiles = (newFiles: MediaFile[]) => {
    setFiles(newFiles);
    localStorage.setItem('lanchanso_media_files', JSON.stringify(newFiles));
  };

  // Filtered files in current folder
  const currentFiles = files.filter(f => {
    const matchesFolder = f.folder === currentFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (f.altText && f.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  // Handle uploading files (mock)
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUploads: MediaFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const isImage = file.type.startsWith('image/');
        const mockUrl = isImage 
          ? URL.createObjectURL(file) 
          : '#';
        
        const newFile: MediaFile = {
          id: `m-upload-${Date.now()}-${i}`,
          name: file.name,
          url: mockUrl,
          type: isImage ? 'image' : file.name.endsWith('.pdf') ? 'pdf' : 'docx',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          createdAt: new Date().toISOString().split('T')[0],
          uploadedBy: 'nvhan166@gmail.com',
          folder: currentFolder,
          altText: file.name.split('.')[0].replace(/_/g, ' '),
          caption: 'Ảnh tải lên từ quản trị viên'
        };
        newUploads.push(newFile);
      }
      saveFiles([...files, ...newUploads]);
    }
  };

  // Create folder simulation
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      const cleanName = newFolderName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      const newPath = currentFolder === '/' ? `/${cleanName}` : `${currentFolder}/${cleanName}`;
      alert(`Đã tạo thư mục ảo: ${newPath}`);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  // Delete file
  const handleDeleteFile = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tệp tin này? Thao tác không thể hoàn tác.')) {
      const updated = files.filter(f => f.id !== id);
      saveFiles(updated);
      if (selectedFileId === id) setSelectedFileId(null);
    }
  };

  // Copy file URL to clipboard
  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle Drop upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const isImage = file.type.startsWith('image/');
      const mockUrl = isImage ? URL.createObjectURL(file) : '#';
      const newFile: MediaFile = {
        id: `m-drag-${Date.now()}`,
        name: file.name,
        url: mockUrl,
        type: isImage ? 'image' : 'pdf',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        createdAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'nvhan166@gmail.com',
        folder: currentFolder,
        altText: file.name,
        caption: 'Kéo thả tải lên'
      };
      saveFiles([...files, newFile]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row min-h-[500px]">
      
      {/* LEFT COLUMN: Folder Tree */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 p-4 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thư mục hệ thống</span>
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="p-1 hover:bg-slate-100 text-blue-700 rounded transition"
            title="Thư mục mới"
          >
            <FolderPlusIcon className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1 max-h-[380px] overflow-y-auto">
          {folders.map(f => {
            const level = f.split('/').length - 2;
            const isSelected = currentFolder === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setCurrentFolder(f);
                  setSelectedFileId(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                  isSelected 
                    ? 'bg-blue-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                style={{ paddingLeft: `${Math.max(0.75, level * 0.75)}rem` }}
              >
                {isSelected ? (
                  <FolderOpen className="w-4 h-4 text-amber-300 flex-shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <span className="truncate">{f === '/' ? 'gốc' : f.split('/').pop()}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT COLUMN: Files Grid & Toolbar */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold flex-wrap">
            <span className="text-slate-400">root</span>
            {currentFolder.split('/').filter(Boolean).map((part, i, arr) => (
              <React.Fragment key={part}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className={i === arr.length - 1 ? 'text-blue-900 font-bold' : ''}>{part}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:self-end">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 w-36 sm:w-48 bg-slate-50"
              />
            </div>

            {/* Upload Button */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-850 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Tải file</span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.docx"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Drop zone file list container */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border-2 border-dashed border-slate-100 rounded-2xl min-h-[250px] overflow-y-auto max-h-[450px]"
        >
          {currentFiles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
              <ImageIcon className="w-12 h-12 text-slate-300" />
              <p className="text-xs font-semibold">Thư mục trống hoặc không khớp từ khóa.</p>
              <p className="text-[10px] text-slate-300">Kéo thả ảnh hoặc click "Tải file" để thêm dữ liệu.</p>
            </div>
          ) : (
            currentFiles.map(file => {
              const isSelected = selectedFileId === file.id;
              return (
                <div 
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  onDoubleClick={() => {
                    if (onSelectImage && file.type === 'image') {
                      onSelectImage(file.url, file.altText);
                    } else {
                      setPreviewFile(file);
                    }
                  }}
                  className={`border rounded-xl p-2 cursor-pointer transition relative flex flex-col justify-between group ${
                    isSelected 
                      ? 'border-blue-700 bg-blue-50/20 ring-1 ring-blue-700' 
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 bg-white'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center relative mb-2">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.altText || file.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : file.type === 'pdf' ? (
                      <div className="flex flex-col items-center gap-1 text-rose-600">
                        <FileText className="w-8 h-8" />
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 px-1 rounded">PDF</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-blue-600">
                        <FileCode className="w-8 h-8" />
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 px-1 rounded">DOCX</span>
                      </div>
                    )}

                    {/* Quick selection status */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-blue-900 text-white p-0.5 rounded-full shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5 px-0.5">
                    <p className="text-[11px] font-bold text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                      <span>{file.size}</span>
                      <span>{file.createdAt}</span>
                    </div>
                  </div>

                  {/* Hover Controls */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white/90 backdrop-blur p-1 rounded-lg border border-slate-100 shadow-sm">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                      }}
                      className="p-1 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded transition"
                      title="Xem trước"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file);
                      }}
                      className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded transition"
                      title="Sao chép URL"
                    >
                      {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="p-1 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Selection Insert Footer */}
        {isSelectMode && selectedFileId && (
          <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Đã chọn: <strong className="text-blue-900">{files.find(f => f.id === selectedFileId)?.name}</strong>
            </div>
            <button
              onClick={() => {
                const item = files.find(f => f.id === selectedFileId);
                if (item && item.type === 'image' && onSelectImage) {
                  onSelectImage(item.url, item.altText);
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
            >
              Chèn vào bài viết
            </button>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateFolder} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">Tạo thư mục con</h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Tên thư mục</label>
              <input
                type="text"
                placeholder="VD: scam-images"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
            </div>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                className="px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-850 font-bold transition"
              >
                Tạo thư mục
              </button>
            </div>
          </form>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 max-w-lg w-full">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{previewFile.name}</span>
              <button 
                onClick={() => setPreviewFile(null)}
                className="p-1 hover:bg-slate-200 text-slate-500 rounded transition"
              >
                <Trash2 className="w-4 h-4 rotate-45" /> {/* Close button replacement with rotated Trash icon or simple cancel */}
              </button>
            </div>
            <div className="p-5 flex flex-col items-center justify-center bg-slate-950/5 min-h-[250px]">
              {previewFile.type === 'image' ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.altText || previewFile.name}
                  className="max-h-[300px] object-contain rounded-lg shadow border border-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-500">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold">Không thể xem trực tiếp tệp tin {previewFile.type.toUpperCase()}</p>
                  <p className="text-[10px] text-slate-400">Vui lòng tải về máy tính để đọc.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div><span className="text-slate-400 font-medium">Kích thước:</span> <strong className="text-slate-700">{previewFile.size}</strong></div>
                <div><span className="text-slate-400 font-medium">Tải lên:</span> <strong className="text-slate-700">{previewFile.createdAt}</strong></div>
                <div><span className="text-slate-400 font-medium">Tác giả:</span> <strong className="text-slate-700">{previewFile.uploadedBy}</strong></div>
                <div><span className="text-slate-400 font-medium">Thư mục:</span> <strong className="text-slate-700">{previewFile.folder}</strong></div>
              </div>
              {previewFile.altText && (
                <div className="border-t border-slate-150 pt-2">
                  <span className="text-slate-400 font-medium block">Mô tả (Alt text):</span>
                  <p className="text-slate-700 font-semibold">{previewFile.altText}</p>
                </div>
              )}
              {previewFile.caption && (
                <div>
                  <span className="text-slate-400 font-medium block">Chú thích:</span>
                  <p className="text-slate-700 italic">{previewFile.caption}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-150">
                <button
                  onClick={() => handleCopyUrl(previewFile)}
                  className="px-3.5 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép URL</span>
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-850 text-white rounded-lg text-[11px] font-bold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom smaller helper icons since Lucide sometimes fails custom sub-icons
function FolderPlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>
      <line x1="12" y1="10" x2="12" y2="16"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
    </svg>
  );
}
