import React, { useState, useEffect, useRef } from 'react';
import { Person, Gender, LifeStatus } from '../../types/genealogy';
import { 
  X, Save, Upload, Image, Trash2, Sparkles, User, 
  Calendar, MapPin, BookOpen, Shield, Heart, Award
} from 'lucide-react';

// Mẫu chân dung truyền thống văn hóa Việt Nam
export const PRESET_AVATARS = [
  {
    label: 'Cụ Ông Truyền Thống',
    gender: 'MALE',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Cụ Bà Phúc Hậu',
    gender: 'FEMALE',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Trung Niên Lịch Lãm',
    gender: 'MALE',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Phụ Nữ Truyền Thống',
    gender: 'FEMALE',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Thanh Niên Hiện Đại',
    gender: 'MALE',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Thiếu Nữ Duyên Dáng',
    gender: 'FEMALE',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Biểu Tượng Chữ Phúc (Son Vàng)',
    gender: 'OTHER',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Biểu Tượng Chữ Thọ (Cổ Kính)',
    gender: 'OTHER',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80',
  },
];

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  onSave: (updatedPerson: Person) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  person,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [courtesyName, setCourtesyName] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [generation, setGeneration] = useState<number>(1);
  const [branchName, setBranchName] = useState('Chi Trưởng');
  const [orderInFamily, setOrderInFamily] = useState('Trưởng nam');
  const [status, setStatus] = useState<LifeStatus>('LIVING');
  const [birthDateMode, setBirthDateMode] = useState<'YEAR_ONLY' | 'FULL_DATE'>('YEAR_ONLY');
  const [birthYear, setBirthYear] = useState<string>('');
  const [solarBirthDate, setSolarBirthDate] = useState<string>('');
  const [lunarBirthDate, setLunarBirthDate] = useState<string>('');
  const [deathDateMode, setDeathDateMode] = useState<'YEAR_ONLY' | 'FULL_DATE'>('YEAR_ONLY');
  const [deathYear, setDeathYear] = useState<string>('');
  const [solarDeathDate, setSolarDeathDate] = useState<string>('');
  const [lunarDeathDate, setLunarDeathDate] = useState<string>('');
  const [lunarDeathCanChi, setLunarDeathCanChi] = useState<string>('');
  const [currentResidence, setCurrentResidence] = useState<string>('');
  const [tombLocation, setTombLocation] = useState<string>('');
  const [biography, setBiography] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [achievementsText, setAchievementsText] = useState<string>('');
  const [showPresetAvatars, setShowPresetAvatars] = useState<boolean>(false);

  // Maternal & Lineage states
  const [isLineage, setIsLineage] = useState<boolean>(true);
  const [maternalClanName, setMaternalClanName] = useState<string>('');
  const [maternalOriginPlace, setMaternalOriginPlace] = useState<string>('');
  const [maternalFather, setMaternalFather] = useState<string>('');
  const [maternalMother, setMaternalMother] = useState<string>('');
  const [maternalNotes, setMaternalNotes] = useState<string>('');

  // Load existing person data whenever modal opens or person changes
  useEffect(() => {
    if (person) {
      setFullName(person.fullName || '');
      setCourtesyName(person.courtesyName || '');
      setGender(person.gender || 'MALE');
      setGeneration(person.generation || 1);
      setBranchName(person.branchName || 'Chi Trưởng');
      setOrderInFamily(person.orderInFamily || 'Trưởng nam');
      setStatus(person.status || 'LIVING');
      setBirthYear(person.birthYear ? String(person.birthYear) : '');
      setSolarBirthDate(person.solarBirthDate || '');
      setLunarBirthDate(person.lunarBirthDate || '');
      setBirthDateMode(person.solarBirthDate ? 'FULL_DATE' : 'YEAR_ONLY');
      setDeathYear(person.deathYear ? String(person.deathYear) : '');
      setSolarDeathDate(person.solarDeathDate || '');
      setDeathDateMode(person.solarDeathDate ? 'FULL_DATE' : 'YEAR_ONLY');
      setLunarDeathDate(person.lunarDeathDate || '');
      setLunarDeathCanChi(person.lunarDeathCanChi || '');
      setCurrentResidence(person.currentResidence || '');
      setTombLocation(person.tombLocation || '');
      setBiography(person.biography || '');
      setAvatarUrl(person.avatarUrl || '');
      setAchievementsText(person.achievements ? person.achievements.join('\n') : '');
      setIsLineage(person.isLineage !== undefined ? person.isLineage : true);
      setMaternalClanName(person.maternalClanName || '');
      setMaternalOriginPlace(person.maternalOriginPlace || '');
      setMaternalFather(person.maternalFather || '');
      setMaternalMother(person.maternalMother || '');
      setMaternalNotes(person.maternalNotes || '');
    }
  }, [person, isOpen]);

  if (!isOpen || !person) return null;

  // Handle local image upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa là 5MB. Vui lòng chọn ảnh nhỏ hơn!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Vui lòng nhập Họ và tên thành viên!');
      return;
    }

    const achievements = achievementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // Tính toán năm sinh và ngày sinh dương lịch
    let calculatedBirthYear: number | undefined;
    let finalSolarBirthDate: string | undefined;

    if (birthDateMode === 'FULL_DATE') {
      finalSolarBirthDate = solarBirthDate.trim() || undefined;
      if (solarBirthDate) {
        const yearMatch = solarBirthDate.match(/(\d{4})/);
        if (yearMatch) {
          calculatedBirthYear = parseInt(yearMatch[1], 10);
        }
      }
    } else {
      calculatedBirthYear = birthYear ? parseInt(birthYear, 10) : undefined;
    }

    // Tính toán năm mất và ngày mất dương lịch
    let calculatedDeathYear: number | undefined;
    let finalSolarDeathDate: string | undefined;

    if (status === 'DECEASED') {
      if (deathDateMode === 'FULL_DATE') {
        finalSolarDeathDate = solarDeathDate.trim() || undefined;
        if (solarDeathDate) {
          const yearMatch = solarDeathDate.match(/(\d{4})/);
          if (yearMatch) {
            calculatedDeathYear = parseInt(yearMatch[1], 10);
          }
        }
      } else {
        calculatedDeathYear = deathYear ? parseInt(deathYear, 10) : undefined;
      }
    }

    const updated: Person = {
      ...person,
      fullName: fullName.trim(),
      courtesyName: courtesyName.trim() || undefined,
      gender,
      generation: Number(generation) || 1,
      branchName: branchName.trim() || 'Chi Trưởng',
      orderInFamily: orderInFamily.trim() || undefined,
      status,
      birthYear: calculatedBirthYear,
      solarBirthDate: finalSolarBirthDate,
      lunarBirthDate: lunarBirthDate.trim() || undefined,
      deathYear: status === 'DECEASED' ? calculatedDeathYear : undefined,
      solarDeathDate: status === 'DECEASED' ? finalSolarDeathDate : undefined,
      lunarDeathDate: status === 'DECEASED' && lunarDeathDate ? lunarDeathDate.trim() : undefined,
      lunarDeathCanChi: status === 'DECEASED' && lunarDeathCanChi ? lunarDeathCanChi.trim() : undefined,
      currentResidence: currentResidence.trim() || undefined,
      tombLocation: status === 'DECEASED' && tombLocation ? tombLocation.trim() : undefined,
      biography: biography.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      achievements: achievements.length > 0 ? achievements : undefined,
      isLineage,
      maternalClanName: maternalClanName.trim() || undefined,
      maternalOriginPlace: maternalOriginPlace.trim() || undefined,
      maternalFather: maternalFather.trim() || undefined,
      maternalMother: maternalMother.trim() || undefined,
      maternalNotes: maternalNotes.trim() || undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7EE] border-2 border-heritage-gold/50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-heritage-crimson via-heritage-crimsonDark to-stone-900 text-white flex items-center justify-between border-b border-heritage-gold/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold border border-heritage-gold/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Chỉnh Sửa Thông Tin Thành Viên
              </h3>
              <p className="text-[11px] text-heritage-goldLight">
                {person.fullName} • Đời thứ {person.generation} • {person.branchName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PHẦN 1: ẢNH ĐẠI DIỆN (AVATAR) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-heritage-gold/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <label className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5">
                <Image className="w-4 h-4" />
                1. Hình Ảnh Đại Diện (Chân Dung Thành Viên)
              </label>
              <span className="text-[11px] text-stone-500">
                Hiển thị trên cây phả hệ & hồ sơ dòng họ
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-heritage-gold shadow-md bg-heritage-parchment flex items-center justify-center font-serif text-3xl font-bold text-heritage-crimson ring-4 ring-heritage-gold/20">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Ảnh đại diện"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{fullName ? fullName.charAt(0).toUpperCase() : 'T'}</span>
                  )}
                </div>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md text-xs transition-colors"
                    title="Gỡ ảnh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Upload Controls & Link */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-heritage-crimson hover:bg-heritage-crimsonDark text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-heritage-goldLight" />
                    Tải Ảnh Lên Từ Máy Tính
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPresetAvatars(!showPresetAvatars)}
                    className="px-3 py-2 bg-heritage-parchment hover:bg-[#EFE7D3] text-stone-800 border border-heritage-gold/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {showPresetAvatars ? 'Ẩn Kho Ảnh Mẫu' : 'Chọn Từ Kho Ảnh Mẫu'}
                  </button>
                </div>

                {/* Input direct URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Hoặc dán trực tiếp đường dẫn hình ảnh (URL):
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/anh-chan-dung.jpg"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                  />
                </div>
              </div>
            </div>

            {/* Kho ảnh đại diện mẫu */}
            {showPresetAvatars && (
              <div className="mt-3 pt-3 border-t border-stone-200">
                <p className="text-[11px] font-bold text-stone-700 mb-2">
                  Chọn ảnh chân dung mẫu phù hợp (Click vào ảnh để áp dụng):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setAvatarUrl(preset.url);
                        setShowPresetAvatars(false);
                      }}
                      className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2 bg-stone-50 hover:bg-amber-50 hover:border-heritage-gold ${
                        avatarUrl === preset.url ? 'border-heritage-crimson bg-amber-50 ring-2 ring-heritage-crimson/30' : 'border-stone-200'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-9 h-9 rounded-full object-cover border border-heritage-gold/50 shrink-0"
                      />
                      <span className="text-[10px] font-medium text-stone-800 leading-tight">
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PHẦN 2: THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <User className="w-4 h-4" />
              2. Thông Tin Định Danh & Phả Hệ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Họ và tên thành viên <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên tự / Tên húy / Tên hiệu (nếu có):
                </label>
                <input
                  type="text"
                  value={courtesyName}
                  onChange={(e) => setCourtesyName(e.target.value)}
                  placeholder="Ví dụ: Tự Phúc Hậu, Hiệu Cúc Am"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Giới tính:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      gender === 'MALE'
                        ? 'bg-[#EBF1ED] border-heritage-moss text-heritage-moss shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    Nam
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      gender === 'FEMALE'
                        ? 'bg-[#F9ECEC] border-heritage-crimson text-heritage-crimson shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Thứ bậc trong gia đình:
                </label>
                <input
                  type="text"
                  value={orderInFamily}
                  onChange={(e) => setOrderInFamily(e.target.value)}
                  placeholder="Ví dụ: Trưởng nam, Thứ nam, Trưởng nữ, Chính thất..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đời thứ (Thế hệ):
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={generation}
                  onChange={(e) => setGeneration(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Chi / Cành dòng họ:
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Ví dụ: Chi Trưởng (Ngành 1), Chi Hai..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 3: SINH TỬ & NGÀY KỴ NHẬT */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <Calendar className="w-4 h-4" />
              3. Tình Trạng Sinh Tử & Ngày Giỗ Kỵ Nhật
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tình trạng sinh tử:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LifeStatus)}
                  className="w-full sm:w-1/2 p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                >
                  <option value="LIVING">Còn sống (Đang hưởng thọ)</option>
                  <option value="DECEASED">Đã khuất (Quy tiên)</option>
                </select>
              </div>

              {/* KHỐI NGÀY / NĂM SINH: CÁC CỤ VS CON CHÁU */}
              <div className="bg-[#FAF7EE] p-3.5 sm:p-4 rounded-xl border border-heritage-gold/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                  <label className="text-xs font-bold text-heritage-crimson flex items-center gap-1.5 uppercase tracking-wide">
                    <Calendar className="w-4 h-4 text-heritage-gold" />
                    Thông Tin Ngày / Năm Sinh
                  </label>
                  
                  {/* Chuyển chế độ: Chỉ nhớ năm vs Đầy đủ ngày tháng năm */}
                  <div className="flex items-center p-0.5 bg-white border border-stone-300 rounded-lg text-[11px] font-semibold shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setBirthDateMode('YEAR_ONLY')}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                        birthDateMode === 'YEAR_ONLY'
                          ? 'bg-heritage-crimson text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>📜 Chỉ nhớ năm sinh (Các Cụ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthDateMode('FULL_DATE')}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                        birthDateMode === 'FULL_DATE'
                          ? 'bg-heritage-crimson text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>📅 Đầy đủ Ngày - Tháng - Năm (Con Cháu)</span>
                    </button>
                  </div>
                </div>

                {birthDateMode === 'YEAR_ONLY' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Năm sinh (Dương lịch):
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="Ví dụ: 1912, 1945..."
                        className="w-full sm:w-48 p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                      <span className="text-[11px] text-stone-500 italic">
                        (Thích hợp cho các cụ đời trước không còn nhớ chính xác ngày tháng)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-800 mb-1">
                        Ngày / Tháng / Năm sinh (Dương lịch):
                      </label>
                      <input
                        type="date"
                        value={solarBirthDate}
                        onChange={(e) => {
                          setSolarBirthDate(e.target.value);
                          if (e.target.value) {
                            const y = e.target.value.split('-')[0];
                            if (y) setBirthYear(y);
                          }
                        }}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-800 mb-1">
                        Ngày sinh Âm lịch (nếu có):
                      </label>
                      <input
                        type="text"
                        value={lunarBirthDate}
                        onChange={(e) => setLunarBirthDate(e.target.value)}
                        placeholder="Ví dụ: 15/07 Âm lịch (Rằm tháng Bảy)"
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* KHỐI NGÀY MẤT & NGÀY GIỖ (NẾU ĐÃ KHUẤT) */}
              {status === 'DECEASED' && (
                <div className="bg-[#FAF7EE] p-3.5 sm:p-4 rounded-xl border border-heritage-gold/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                    <label className="text-xs font-bold text-heritage-crimson flex items-center gap-1.5 uppercase tracking-wide">
                      <Calendar className="w-4 h-4 text-heritage-crimson" />
                      Thông Tin Tạ Thế & Ngày Giỗ Kỵ Nhật
                    </label>

                    <div className="flex items-center p-0.5 bg-white border border-stone-300 rounded-lg text-[11px] font-semibold shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setDeathDateMode('YEAR_ONLY')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          deathDateMode === 'YEAR_ONLY'
                            ? 'bg-heritage-crimson text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Chỉ nhớ năm mất
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeathDateMode('FULL_DATE')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          deathDateMode === 'FULL_DATE'
                            ? 'bg-heritage-crimson text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Đầy đủ Ngày - Tháng - Năm mất
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {deathDateMode === 'YEAR_ONLY' ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Năm mất (Dương lịch):
                        </label>
                        <input
                          type="number"
                          value={deathYear}
                          onChange={(e) => setDeathYear(e.target.value)}
                          placeholder="Ví dụ: 1980"
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Ngày / Tháng / Năm mất (Dương lịch):
                        </label>
                        <input
                          type="date"
                          value={solarDeathDate}
                          onChange={(e) => {
                            setSolarDeathDate(e.target.value);
                            if (e.target.value) {
                              const y = e.target.value.split('-')[0];
                              if (y) setDeathYear(y);
                            }
                          }}
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Ngày giỗ hằng năm (Lịch Âm) <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={lunarDeathDate}
                        onChange={(e) => setLunarDeathDate(e.target.value)}
                        placeholder="Ví dụ: 15/08 Âm lịch, mùng 2 tháng Ba..."
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-heritage-crimson focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Năm mất Can Chi:
                      </label>
                      <input
                        type="text"
                        value={lunarDeathCanChi}
                        onChange={(e) => setLunarDeathCanChi(e.target.value)}
                        placeholder="Ví dụ: Quý Mão, Nhâm Dần..."
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Nơi an nghỉ (Mộ phần / Nghĩa trang):
                      </label>
                      <input
                        type="text"
                        value={tombLocation}
                        onChange={(e) => setTombLocation(e.target.value)}
                        placeholder="Ví dụ: Nghĩa trang quê tổ Cổ Đô, khu C..."
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                      />
                    </div>
                  </div>
                </div>
              )}

              {status === 'LIVING' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nơi cư trú / Làm việc hiện tại:
                  </label>
                  <input
                    type="text"
                    value={currentResidence}
                    onChange={(e) => setCurrentResidence(e.target.value)}
                    placeholder="Ví dụ: Cầu Giấy, Hà Nội hoặc TP. Hồ Chí Minh..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PHẦN 4: TIỂU SỬ & CÔNG TRẠNG */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <BookOpen className="w-4 h-4" />
              4. Tiểu Sử Phả Ký & Công Trạng Danh Hiệu
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tiểu sử cuộc đời & đóng góp cho dòng họ:
              </label>
              <textarea
                rows={3}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Nhập tiểu sử, con đường học tập, sự nghiệp và cống hiến..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Công trạng, học vị, danh hiệu (mỗi dòng một mục):
              </label>
              <textarea
                rows={2}
                value={achievementsText}
                onChange={(e) => setAchievementsText(e.target.value)}
                placeholder="Cử nhân Khoa học, Bằng khen Dòng họ năm 2020&#10;Huy chương vì sự nghiệp xây dựng quê hương..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
              />
            </div>
          </div>

          {/* PHẦN 5: THÂN THẾ BÊN NGOẠI (GỐC TÍCH QUÊ NGOẠI & DÂU / RỂ) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-300/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-heritage-crimson" />
                5. Thân Thế Bên Ngoại (Gốc Tích Quê Ngoại & Dâu / Rể)
              </label>
              <span className="text-[11px] text-amber-700 font-medium">
                Ghi nhớ cội nguồn bên mẹ / bên dâu rể
              </span>
            </div>

            {/* Thuộc họ nội hay dâu/rể */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Quan hệ huyết thống với Dòng Họ:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  isLineage 
                    ? 'border-heritage-crimson bg-[#FAF1F1] text-heritage-crimson font-bold shadow-xs' 
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}>
                  <input
                    type="radio"
                    name="isLineageRadio"
                    checked={isLineage}
                    onChange={() => setIsLineage(true)}
                    className="accent-heritage-crimson"
                  />
                  <span>Con Cháu Họ Nội (Trực hệ)</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  !isLineage 
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs' 
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}>
                  <input
                    type="radio"
                    name="isLineageRadio"
                    checked={!isLineage}
                    onChange={() => setIsLineage(false)}
                    className="accent-amber-600"
                  />
                  <span>Dâu Họ / Rể Họ (Phối ngẫu)</span>
                </label>
              </div>
            </div>

            {/* Dòng họ ngoại & Quê ngoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dòng Họ Bên Ngoại:
                </label>
                <input
                  type="text"
                  value={maternalClanName}
                  onChange={(e) => setMaternalClanName(e.target.value)}
                  placeholder="Ví dụ: Lê Tộc, Trần Tộc, Đỗ Tộc..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quê Ngoại / Bản Quán Nhà Mẹ:
                </label>
                <input
                  type="text"
                  value={maternalOriginPlace}
                  onChange={(e) => setMaternalOriginPlace(e.target.value)}
                  placeholder="Ví dụ: Làng Cổ Đô, Ba Vì, Hà Nội..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>
            </div>

            {/* Thân sinh cụ ông / cụ bà bên ngoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cụ Ông Bên Ngoại (Thân sinh):
                </label>
                <input
                  type="text"
                  value={maternalFather}
                  onChange={(e) => setMaternalFather(e.target.value)}
                  placeholder="Ví dụ: Cụ Lê Văn Giáp (Tri phủ...)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cụ Bà Bên Ngoại (Thân mẫu):
                </label>
                <input
                  type="text"
                  value={maternalMother}
                  onChange={(e) => setMaternalMother(e.target.value)}
                  placeholder="Ví dụ: Cụ Bà Trần Thị Đoan..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>
            </div>

            {/* Ghi chú thế gia bên ngoại */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ghi Chú Thân Thế & Gia Phong Bên Ngoại:
              </label>
              <textarea
                rows={2}
                value={maternalNotes}
                onChange={(e) => setMaternalNotes(e.target.value)}
                placeholder="Ghi lại truyền thống gia đình bên ngoại, công trạng, hương ước hoặc kỷ niệm dòng họ ngoại..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson leading-relaxed"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition-colors"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark hover:from-heritage-crimsonDark hover:to-heritage-crimson text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Save className="w-4 h-4 text-heritage-goldLight" />
            Lưu Thay Đổi (Cập Nhật)
          </button>
        </div>
      </div>
    </div>
  );
};
