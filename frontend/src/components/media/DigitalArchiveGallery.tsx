import React, { useState, useEffect, useRef } from 'react';
import { MediaAsset } from '../../services/api';
import { Person } from '../../types/genealogy';
import {
  X,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Calendar,
  Maximize2,
  Plus,
  Upload,
  Search,
  User,
  MapPin,
  Download,
  Edit3,
  Trash2,
  ScrollText,
  GitBranch,
  Camera,
  Check,
  Sliders,
  Filter,
} from 'lucide-react';

interface DigitalArchiveGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaAsset[];
  clanName: string;
  allPersons: Person[];
  initialFilterPersonId?: string | null;
  initialOpenUploadForPersonId?: string | null;
  onAddMedia: (newMedia: Omit<MediaAsset, 'id' | 'createdAt'>) => void;
  onUpdateMedia: (updatedMedia: MediaAsset) => void;
  onDeleteMedia: (mediaId: string) => void;
  onSelectPersonInTree?: (person: Person) => void;
  onSetAsPersonAvatar?: (personId: string, fileUrl: string) => void;
}

type RestorationMode = 'ORIGINAL' | 'RESTORE_PORTRAIT' | 'INK_DOCUMENT' | 'ANTIQUE_SEPIA' | 'BW_SHARP';

const CATEGORIES = [
  { id: 'ALL', label: 'Tất Cả Tư Liệu', badgeColor: 'bg-stone-700' },
  { id: 'PHOTO', label: 'Từ Đường & Lăng Mộ', badgeColor: 'bg-emerald-700' },
  { id: 'DOCUMENT', label: 'Sắc Phong & Văn Bia', badgeColor: 'bg-[#8B2E2E]' },
  { id: 'ALTAR_RESTORED', label: 'Chân Dung & Ảnh Thờ', badgeColor: 'bg-amber-600' },
  { id: 'FAMILY_EVENT', label: 'Sự Kiện & Họp Họ', badgeColor: 'bg-sky-700' },
];

const MEDIA_TYPE_LABELS: Record<string, string> = {
  PHOTO: 'Từ Đường & Lăng Mộ',
  DOCUMENT: 'Sắc Phong & Văn Bia',
  ALTAR_RESTORED: 'Chân Dung & Ảnh Thờ',
  FAMILY_EVENT: 'Sự Kiện & Họp Họ',
};

export const DigitalArchiveGallery: React.FC<DigitalArchiveGalleryProps> = ({
  isOpen,
  onClose,
  mediaList,
  clanName,
  allPersons,
  initialFilterPersonId,
  initialOpenUploadForPersonId,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onSelectPersonInTree,
  onSetAsPersonAvatar,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [filterPersonId, setFilterPersonId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<MediaAsset | null>(null);
  const [ornateFrame, setOrnateFrame] = useState<boolean>(true);
  const [avatarSuccessToast, setAvatarSuccessToast] = useState<string | null>(null);

  // Upload / Edit Form Modal State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MediaAsset | null>(null);
  const [title, setTitle] = useState<string>('');
  const [mediaType, setMediaType] = useState<string>('DOCUMENT');
  const [relatedPersonId, setRelatedPersonId] = useState<string>('');
  const [takenYear, setTakenYear] = useState<string>(String(new Date().getFullYear()));
  const [location, setLocation] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [rawImageUrl, setRawImageUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [restorationMode, setRestorationMode] = useState<RestorationMode>('ORIGINAL');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial filters when opened from MemberProfileDrawer
  useEffect(() => {
    if (isOpen) {
      if (initialOpenUploadForPersonId) {
        setFilterPersonId(initialOpenUploadForPersonId);
        handleOpenCreateForm(initialOpenUploadForPersonId);
      } else if (initialFilterPersonId) {
        setFilterPersonId(initialFilterPersonId);
        setActiveCategory('ALL');
      } else {
        setFilterPersonId('ALL');
      }
    } else {
      setIsFormOpen(false);
      setSelectedImage(null);
    }
  }, [isOpen, initialFilterPersonId, initialOpenUploadForPersonId]);

  // Apply Canvas image restoration filter whenever rawImageUrl or restorationMode changes
  useEffect(() => {
    if (!rawImageUrl) {
      setProcessedImageUrl('');
      return;
    }
    if (restorationMode === 'ORIGINAL') {
      setProcessedImageUrl(rawImageUrl);
      return;
    }

    let isCancelled = false;
    setIsProcessingImage(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 1100;
        let w = img.width || 800;
        let h = img.height || 600;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProcessedImageUrl(rawImageUrl);
          setIsProcessingImage(false);
          return;
        }

        // Apply CSS filter on canvas context
        if (restorationMode === 'RESTORE_PORTRAIT') {
          ctx.filter = 'contrast(1.18) saturate(1.22) brightness(1.04) sepia(0.08)';
        } else if (restorationMode === 'INK_DOCUMENT') {
          ctx.filter = 'contrast(1.55) brightness(1.08) saturate(0.75)';
        } else if (restorationMode === 'ANTIQUE_SEPIA') {
          ctx.filter = 'sepia(0.65) contrast(1.15) brightness(0.98)';
        } else if (restorationMode === 'BW_SHARP') {
          ctx.filter = 'grayscale(1) contrast(1.38) brightness(1.04)';
        }

        ctx.drawImage(img, 0, 0, w, h);

        // Add subtle warm vignette for RESTORE_PORTRAIT or ANTIQUE_SEPIA
        if (restorationMode === 'RESTORE_PORTRAIT' || restorationMode === 'ANTIQUE_SEPIA') {
          ctx.filter = 'none';
          const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, 'rgba(35, 18, 5, 0.25)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        const resultDataUrl = canvas.toDataURL('image/jpeg', 0.86);
        if (!isCancelled) {
          setProcessedImageUrl(resultDataUrl);
          setIsProcessingImage(false);
        }
      } catch {
        // Fallback if CORS blocks canvas export on external URL
        if (!isCancelled) {
          setProcessedImageUrl(rawImageUrl);
          setIsProcessingImage(false);
        }
      }
    };
    img.onerror = () => {
      if (!isCancelled) {
        setProcessedImageUrl(rawImageUrl);
        setIsProcessingImage(false);
      }
    };
    img.src = rawImageUrl;

    return () => {
      isCancelled = true;
    };
  }, [rawImageUrl, restorationMode]);

  if (!isOpen) return null;

  const getPersonById = (personId?: string): Person | undefined => {
    if (!personId) return undefined;
    return allPersons.find((p) => p.id === personId);
  };

  const handleOpenCreateForm = (defaultPersonId?: string) => {
    setEditingItem(null);
    const targetPerson = defaultPersonId ? getPersonById(defaultPersonId) : undefined;
    setTitle(targetPerson ? `Tư liệu về ${targetPerson.fullName}` : '');
    setMediaType(targetPerson ? 'ALTAR_RESTORED' : 'DOCUMENT');
    setRelatedPersonId(defaultPersonId || (filterPersonId !== 'ALL' ? filterPersonId : ''));
    setTakenYear(String(new Date().getFullYear()));
    setLocation('');
    setCaption('');
    setTranscription('');
    setRawImageUrl('');
    setProcessedImageUrl('');
    setRestorationMode('ORIGINAL');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: MediaAsset) => {
    setEditingItem(item);
    setTitle(item.title);
    setMediaType(item.mediaType || 'PHOTO');
    setRelatedPersonId(item.relatedPersonId || '');
    setTakenYear(item.takenYear ? String(item.takenYear) : '');
    setLocation(item.location || '');
    setCaption(item.caption || '');
    setTranscription(item.transcription || '');
    setRawImageUrl(item.fileUrl);
    setProcessedImageUrl(item.fileUrl);
    setRestorationMode('ORIGINAL');
    setSelectedImage(null);
    setIsFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa 10MB. Vui lòng chọn tệp nhỏ hơn!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Compress uploaded file via canvas so localStorage and DB stay fast
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1100;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setRawImageUrl(compressed);
            setProcessedImageUrl(compressed);
          } else {
            setRawImageUrl(reader.result as string);
            setProcessedImageUrl(reader.result as string);
          }
        };
        img.src = reader.result;

        if (!title.trim()) {
          const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(cleanFileName);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = processedImageUrl || rawImageUrl;
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề tư liệu!');
      return;
    }
    if (!finalUrl.trim()) {
      alert('Vui lòng tải ảnh lên hoặc nhập đường dẫn hình ảnh tư liệu!');
      return;
    }

    const parsedYear = takenYear ? parseInt(takenYear, 10) : undefined;
    const finalMediaType =
      restorationMode === 'RESTORE_PORTRAIT' && mediaType === 'PHOTO'
        ? 'ALTAR_RESTORED'
        : mediaType;

    if (editingItem) {
      onUpdateMedia({
        ...editingItem,
        title: title.trim(),
        mediaType: finalMediaType,
        relatedPersonId: relatedPersonId || undefined,
        fileUrl: finalUrl,
        caption: caption.trim() || undefined,
        transcription: transcription.trim() || undefined,
        location: location.trim() || undefined,
        takenYear: !isNaN(parsedYear as number) ? parsedYear : undefined,
      });
    } else {
      onAddMedia({
        treeId: mediaList[0]?.treeId || 'tree-nguyen-dai-toc-01',
        title: title.trim(),
        mediaType: finalMediaType,
        relatedPersonId: relatedPersonId || undefined,
        fileUrl: finalUrl,
        caption: caption.trim() || undefined,
        transcription: transcription.trim() || undefined,
        location: location.trim() || undefined,
        takenYear: !isNaN(parsedYear as number) ? parsedYear : undefined,
      });
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDownloadImage = (item: MediaAsset) => {
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSetAvatar = (personId: string, fileUrl: string, personName: string) => {
    if (onSetAsPersonAvatar) {
      onSetAsPersonAvatar(personId, fileUrl);
      setAvatarSuccessToast(`Đã đặt làm ảnh đại diện cho ${personName}!`);
      setTimeout(() => setAvatarSuccessToast(null), 3500);
    }
  };

  // Filter logic
  const filtered = mediaList.filter((m) => {
    const matchCategory = activeCategory === 'ALL' || m.mediaType === activeCategory;
    const matchPerson = filterPersonId === 'ALL' || m.relatedPersonId === filterPersonId;
    const q = searchQuery.trim().toLowerCase();
    const relatedPerson = getPersonById(m.relatedPersonId);
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      (m.caption && m.caption.toLowerCase().includes(q)) ||
      (m.transcription && m.transcription.toLowerCase().includes(q)) ||
      (m.location && m.location.toLowerCase().includes(q)) ||
      (relatedPerson && relatedPerson.fullName.toLowerCase().includes(q));
    return matchCategory && matchPerson && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2E2E] via-[#742222] to-[#5A1818] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#E5C378]/40 flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5 text-[#E5C378]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wide flex items-center gap-2">
                Kho Tư Liệu Số & Bảo Vật Dòng Họ
                <span className="text-[11px] bg-[#E5C378]/20 text-[#F5D996] px-2.5 py-0.5 rounded-full border border-[#E5C378]/40 font-sans font-semibold">
                  {mediaList.length} di sản
                </span>
              </h2>
              <p className="text-xs text-white/80">
                Số hóa sắc phong, văn bia Hán-Nôm, phục chế ảnh thờ và liên kết trực tiếp với phả đồ {clanName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                onClick={() => handleOpenCreateForm()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4A84F] to-[#B8862D] hover:brightness-110 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tải Lên Tư Liệu / Phục Chế Ảnh</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng kho tư liệu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {avatarSuccessToast && (
          <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
            <Check className="w-4 h-4" />
            <span>{avatarSuccessToast}</span>
          </div>
        )}

        {/* Upload / Edit & AI Restoration Studio View */}
        {isFormOpen ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#FAF7EE]">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#D5C7A9] shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-[#F3ECE0] border-b border-[#D5C7A9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8B2E2E]" />
                  <h3 className="font-serif font-bold text-base text-stone-800">
                    {editingItem ? 'Chỉnh Sửa & Phục Chế Tư Liệu' : 'Tải Lên Tư Liệu Mới & Xưởng Phục Chế Ảnh Thờ'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs font-semibold text-stone-600 hover:text-[#8B2E2E] px-3 py-1 rounded-lg border border-stone-300 bg-white"
                >
                  ← Quay lại Thư viện
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Image Upload + Canvas Restoration Studio (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    1. Hình Ảnh Tư Liệu / Sắc Phong / Chân Dung *
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group aspect-4/3 rounded-xl border-2 border-dashed border-[#C49A45] bg-[#FAF7EE] hover:bg-[#F3ECE0]/70 transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer shadow-inner"
                  >
                    {processedImageUrl ? (
                      <>
                        <img
                          src={processedImageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain bg-stone-900"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1">
                          <Upload className="w-6 h-6 text-[#E5C378]" />
                          <span>Nhấp để chọn ảnh khác từ máy</span>
                        </div>
                        {isProcessingImage && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-amber-300 text-xs font-bold">
                            Đang xử lý phục chế điểm ảnh...
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-[#8B2E2E]/10 text-[#8B2E2E] flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-stone-700">
                          Nhấp để tải ảnh từ máy tính / điện thoại
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Hỗ trợ JPG, PNG, WEBP (Tự động tối ưu hóa độ nét)
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Or paste direct URL */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Hoặc dán đường dẫn ảnh (URL):
                    </label>
                    <input
                      type="text"
                      value={rawImageUrl.startsWith('data:') ? '' : rawImageUrl}
                      onChange={(e) => setRawImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:border-[#8B2E2E] focus:outline-none"
                    />
                  </div>

                  {/* Interactive Restoration Filters */}
                  {rawImageUrl && (
                    <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#D5C7A9] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#8B2E2E] flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          Xưởng Phục Chế & Làm Nét Tự Động
                        </span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                          Canvas AI Filter
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { id: 'ORIGINAL', label: 'Ảnh gốc (Không qua xử lý)' },
                          { id: 'RESTORE_PORTRAIT', label: '✨ Phục chế Chân dung thờ (Tăng chiều sâu & ấm màu)' },
                          { id: 'INK_DOCUMENT', label: '📜 Làm nét Sắc phong / Văn bia (Nổi chữ Hán-Nôm)' },
                          { id: 'ANTIQUE_SEPIA', label: '🏛️ Màu Hoài cổ truyền thần (Sepia thế kỷ XIX)' },
                          { id: 'BW_SHARP', label: '⚫ Đen trắng tương phản cao (Khử ố vàng)' },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setRestorationMode(mode.id as RestorationMode)}
                            className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              restorationMode === mode.id
                                ? 'bg-[#8B2E2E] text-white font-bold shadow-xs'
                                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Metadata & Hán-Nôm Transcription (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    2. Thông Tin Di Sản & Liên Kết Phả Hệ
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Tiêu đề tư liệu / bảo vật *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="VD: Sắc phong Vua Tự Đức ban cho Cụ Tổ đời thứ 2..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#8B2E2E] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phân loại danh mục *
                      </label>
                      <select
                        value={mediaType}
                        onChange={(e) => setMediaType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:border-[#8B2E2E] focus:outline-none font-medium"
                      >
                        <option value="DOCUMENT">📜 Sắc Phong & Văn Bia</option>
                        <option value="ALTAR_RESTORED">🖼️ Chân Dung & Ảnh Thờ</option>
                        <option value="PHOTO">🏯 Từ Đường & Lăng Mộ</option>
                        <option value="FAMILY_EVENT">🏮 Sự Kiện & Họp Họ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Gắn với Thành viên trong Phả hệ
                      </label>
                      <select
                        value={relatedPersonId}
                        onChange={(e) => setRelatedPersonId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:border-[#8B2E2E] focus:outline-none font-medium"
                      >
                        <option value="">-- Tư liệu chung của toàn Dòng Họ --</option>
                        {allPersons.map((p) => (
                          <option key={p.id} value={p.id}>
                            Đời {p.generation} - {p.fullName} ({p.branchName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Năm ghi nhận / Niên đại lịch sử
                      </label>
                      <input
                        type="number"
                        value={takenYear}
                        onChange={(e) => setTakenYear(e.target.value)}
                        placeholder="VD: 1845 hoặc 2025"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#8B2E2E] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Địa điểm lưu giữ / Nơi chụp
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="VD: Gian chính tẩm Từ đường họ Nguyễn"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#8B2E2E] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Chú thích & Ý nghĩa lịch sử
                      </label>
                      <textarea
                        rows={2}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Mô tả hoàn cảnh ra đời, ý nghĩa của bức ảnh hoặc di vật đối với dòng tộc..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#8B2E2E] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#8B2E2E] mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ScrollText className="w-3.5 h-3.5" />
                          Phiên âm Chữ Hán - Nôm & Dịch nghĩa (Dành cho Sắc phong, Văn bia, Câu đối)
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">Không bắt buộc</span>
                      </label>
                      <textarea
                        rows={4}
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        placeholder="Nhập bản phiên âm Hán Việt và bản dịch nghĩa tiếng Việt để con cháu đời sau đọc hiểu được chữ Nho trên sắc phong, văn bia, hoành phi câu đối..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D5C7A9] bg-[#FAF7EE]/60 focus:border-[#8B2E2E] focus:outline-none font-serif leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B2E2E] to-[#681E1E] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingItem ? 'Lưu Cập Nhật Tư Liệu' : 'Lưu Vào Kho Di Sản Dòng Họ'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Filter & Search Toolbar */}
            <div className="px-5 py-3 bg-[#F3ECE0] border-b border-[#D5C7A9] flex flex-wrap items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {CATEGORIES.map((c) => {
                  const count =
                    c.id === 'ALL'
                      ? mediaList.length
                      : mediaList.filter((m) => m.mediaType === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeCategory === c.id
                          ? 'bg-[#8B2E2E] text-white shadow-xs'
                          : 'bg-white/80 text-stone-700 hover:bg-white border border-[#D5C7A9]'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          activeCategory === c.id
                            ? 'bg-white/20 text-white'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Person Filter */}
              <div className="flex flex-wrap items-center gap-2 ml-auto">
                <div className="relative">
                  <Filter className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={filterPersonId}
                    onChange={(e) => setFilterPersonId(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#D5C7A9] text-xs font-medium text-stone-700 focus:outline-none focus:border-[#8B2E2E]"
                  >
                    <option value="ALL">Tất cả thành viên phả hệ</option>
                    {allPersons.map((p) => (
                      <option key={p.id} value={p.id}>
                        Đời {p.generation}: {p.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm sắc phong, văn bia, tên cụ..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#D5C7A9] text-xs text-stone-700 focus:outline-none focus:border-[#8B2E2E] w-48 sm:w-56"
                  />
                </div>
              </div>
            </div>

            {/* Active Person Filter Banner */}
            {filterPersonId !== 'ALL' && (
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8B2E2E]" />
                  <span>
                    Đang lọc riêng hồ sơ tư liệu của:{' '}
                    <strong>{getPersonById(filterPersonId)?.fullName}</strong> (Đời thứ{' '}
                    {getPersonById(filterPersonId)?.generation})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenCreateForm(filterPersonId)}
                    className="font-bold text-[#8B2E2E] hover:underline"
                  >
                    + Thêm tư liệu cho thành viên này
                  </button>
                  <button
                    onClick={() => setFilterPersonId('ALL')}
                    className="text-stone-500 hover:text-stone-800 underline"
                  >
                    Xem toàn bộ dòng họ
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-14 bg-white/60 rounded-2xl border border-dashed border-[#D5C7A9] max-w-lg mx-auto my-4 p-6">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-stone-400 opacity-60" />
                  <p className="font-serif font-bold text-base text-stone-700">
                    Chưa có tư liệu nào khớp với bộ lọc hiện tại
                  </p>
                  <p className="text-xs text-stone-500 mt-1 mb-4">
                    Hãy tải lên ảnh chụp từ đường, mộ phần, sắc phong hoặc chân dung tiền nhân để lưu truyền cho con cháu.
                  </p>
                  <button
                    onClick={() =>
                      handleOpenCreateForm(filterPersonId !== 'ALL' ? filterPersonId : undefined)
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B2E2E] text-white text-xs font-bold shadow-sm hover:bg-[#6E2222]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tải Lên Tư Liệu Đầu Tiên</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((item) => {
                    const linkedPerson = getPersonById(item.relatedPersonId);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        className="group bg-white rounded-xl border border-[#E5DAC0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                      >
                        <div className="relative aspect-16/10 overflow-hidden bg-stone-900">
                          <img
                            src={item.fileUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                            <span className="text-xs text-white flex items-center gap-1 font-medium">
                              <Maximize2 className="w-3.5 h-3.5 text-[#E5C378]" /> Xem chi tiết & Bản dịch
                            </span>
                          </div>

                          {/* Category Badge */}
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold border border-white/20">
                            {MEDIA_TYPE_LABELS[item.mediaType] || item.mediaType}
                          </span>

                          {/* AI Restored or Transcription Badges */}
                          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                            {item.mediaType === 'ALTAR_RESTORED' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/95 text-stone-950 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow">
                                <Sparkles className="w-3 h-3" /> Chân dung thờ
                              </span>
                            )}
                            {item.transcription && (
                              <span className="px-2 py-0.5 rounded-full bg-[#8B2E2E]/95 text-[#F5D996] text-[10px] font-bold flex items-center gap-1 shadow border border-[#E5C378]/40">
                                <ScrollText className="w-3 h-3" /> Có dịch nghĩa Hán-Nôm
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h3 className="font-serif font-bold text-stone-800 text-sm group-hover:text-[#8B2E2E] transition-colors line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.caption || 'Tư liệu di sản lưu truyền nội tộc.'}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-stone-100">
                            {/* Linked Person Pill */}
                            {linkedPerson ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onSelectPersonInTree) {
                                    onSelectPersonInTree(linkedPerson);
                                    onClose();
                                  }
                                }}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#FAF4EB] hover:bg-[#EFE2C8] border border-[#E5C378]/50 text-[11px] text-stone-800 transition-colors"
                                title="Nhấp để định vị thành viên này trên Cây Phả Hệ"
                              >
                                <span className="flex items-center gap-1.5 font-semibold truncate">
                                  <User className="w-3.5 h-3.5 text-[#8B2E2E] shrink-0" />
                                  <span className="truncate">
                                    Đời {linkedPerson.generation}: {linkedPerson.fullName}
                                  </span>
                                </span>
                                <span className="text-[10px] text-[#8B2E2E] font-bold shrink-0 ml-1">
                                  Phả đồ →
                                </span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-stone-400 italic flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> Di sản chung toàn dòng tộc
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-stone-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#8B2E2E]" /> Năm:{' '}
                                <strong>{item.takenYear || 'Cổ truyền'}</strong>
                              </span>
                              {item.location && (
                                <span className="flex items-center gap-1 truncate max-w-[160px]">
                                  <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                                  <span className="truncate">{item.location}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Detailed Lightbox & Hán-Nôm Reader Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="max-w-5xl w-full bg-[#FAF7EE] rounded-2xl overflow-hidden border border-[#D5C7A9] shadow-2xl grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image Viewer with Traditional Golden Frame toggle */}
              <div className="lg:col-span-7 bg-stone-950 flex flex-col items-center justify-between p-4 relative min-h-[320px] max-h-[60vh] lg:max-h-[90vh]">
                <div className="w-full flex items-center justify-between text-xs text-white/80 z-10 pb-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 font-medium">
                    {MEDIA_TYPE_LABELS[selectedImage.mediaType] || selectedImage.mediaType}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrnateFrame(!ornateFrame)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      ornateFrame
                        ? 'bg-[#C49A45] text-stone-950 border-[#E5C378]'
                        : 'bg-white/10 text-white border-white/20'
                    }`}
                  >
                    {ornateFrame ? '✨ Đang bật Khung Thờ Sơn Son Thếp Vàng' : 'Khung ảnh thường'}
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden my-2 w-full">
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      ornateFrame
                        ? 'p-2.5 bg-gradient-to-br from-[#DFB860] via-[#9E7223] to-[#5E3E0B] rounded-xl shadow-[0_0_40px_rgba(212,168,79,0.3)] border-2 border-[#F5D996]'
                        : ''
                    }`}
                  >
                    <img
                      src={selectedImage.fileUrl}
                      alt={selectedImage.title}
                      className={`max-h-[50vh] lg:max-h-[68vh] w-auto object-contain rounded ${
                        ornateFrame ? 'border-4 border-[#681E1E]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Image Actions Bar */}
                <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleDownloadImage(selectedImage)}
                    className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải ảnh gốc
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(selectedImage)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Sửa & Phục chế lại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa tư liệu "${selectedImage.title}" khỏi kho lưu trữ?`)) {
                        onDeleteMedia(selectedImage.id);
                        setSelectedImage(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/35 text-red-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              </div>

              {/* Right: Detailed Heritage Info, Hán-Nôm Transcription & Person Link */}
              <div className="lg:col-span-5 p-6 overflow-y-auto flex flex-col justify-between space-y-5 max-h-[85vh]">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-serif font-bold text-[#8B2E2E] leading-snug">
                      {selectedImage.title}
                    </h3>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-[#F3ECE0] text-stone-700 font-semibold rounded-lg border border-[#D5C7A9] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8B2E2E]" />
                      Niên đại: {selectedImage.takenYear || 'Cổ truyền'}
                    </span>
                    {selectedImage.location && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 font-medium rounded-lg border border-emerald-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        {selectedImage.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Chú thích & Điển tích
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-[#E5DAC0]">
                      {selectedImage.caption || 'Chưa có mô tả chi tiết cho tư liệu này.'}
                    </p>
                  </div>

                  {/* Hán Nôm Transcription Box */}
                  {selectedImage.transcription ? (
                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8B2E2E] flex items-center gap-1.5">
                        <ScrollText className="w-3.5 h-3.5" />
                        Bản Phiên Âm Chữ Hán - Nôm & Dịch Nghĩa
                      </h4>
                      <div className="p-3.5 rounded-xl bg-[#F6EFE0] border-2 border-[#D5C7A9] text-xs text-stone-800 font-serif whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto shadow-inner">
                        {selectedImage.transcription}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-dashed border-[#D5C7A9] bg-white/50 flex items-center justify-between text-xs text-stone-500">
                      <span>Chưa có bản phiên âm / dịch nghĩa văn bia.</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditForm(selectedImage)}
                        className="text-[#8B2E2E] font-bold hover:underline"
                      >
                        + Bổ sung bản dịch
                      </button>
                    </div>
                  )}

                  {/* Linked Person Section */}
                  {(() => {
                    const person = getPersonById(selectedImage.relatedPersonId);
                    if (!person) return null;
                    return (
                      <div className="p-3.5 rounded-xl bg-white border border-[#D5C7A9] space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Nhân vật phả hệ liên quan
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                            Đời thứ {person.generation}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FAF4EB] border border-[#C49A45] overflow-hidden flex items-center justify-center font-serif font-bold text-[#8B2E2E] shrink-0">
                            {person.avatarUrl ? (
                              <img
                                src={person.avatarUrl}
                                alt={person.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              person.fullName.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-serif font-bold text-stone-800 truncate">
                              {person.fullName}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {person.branchName} • {person.orderInFamily || 'Thành viên'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {onSelectPersonInTree && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectPersonInTree(person);
                                setSelectedImage(null);
                                onClose();
                              }}
                              className="py-1.5 px-2.5 rounded-lg bg-[#8B2E2E] hover:bg-[#6E2222] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <GitBranch className="w-3.5 h-3.5" />
                              Xem trên Phả Đồ
                            </button>
                          )}
                          {onSetAsPersonAvatar && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSetAvatar(person.id, selectedImage.fileUrl, person.fullName)
                              }
                              className="py-1.5 px-2.5 rounded-lg bg-[#FAF4EB] hover:bg-[#EFE2C8] text-stone-800 border border-[#C49A45] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#8B2E2E]" />
                              Đặt làm Ảnh Đại Diện
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-3 border-t border-[#D5C7A9] flex items-center justify-between text-[11px] text-stone-500">
                  <span>Lưu trữ tại: {clanName}</span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
