import React, { useState, useRef } from 'react';
import { Person, Relationship, Gender, LifeStatus } from '../../types/genealogy';
import { X, UserPlus, Heart, GitBranch, Calendar, MapPin, BookOpen, Check, Shield, Upload, Image, Trash2, Sparkles } from 'lucide-react';
import { PRESET_AVATARS } from './EditMemberModal';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPersons: Person[];
  treeId: string;
  initialRelativePerson?: Person | null;
  onMemberAdded: (newPerson: Person, newRelationship?: Relationship) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  allPersons,
  treeId,
  initialRelativePerson,
  onMemberAdded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [relationType, setRelationType] = useState<'CHILD' | 'SPOUSE' | 'PARENT' | 'INDEPENDENT'>(
    initialRelativePerson ? 'CHILD' : 'INDEPENDENT'
  );
  const [targetPersonId, setTargetPersonId] = useState<string>(
    initialRelativePerson?.id || allPersons[0]?.id || ''
  );

  // Form fields
  const [fullName, setFullName] = useState('');
  const [courtesyName, setCourtesyName] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [orderInFamily, setOrderInFamily] = useState('Trưởng nam');
  const [branchName, setBranchName] = useState(
    initialRelativePerson?.branchName || 'Chi Trưởng (Ngành 1)'
  );
  const [generation, setGeneration] = useState<number>(
    initialRelativePerson ? initialRelativePerson.generation + 1 : 1
  );
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
  const [tombLocation, setTombLocation] = useState<string>('');
  const [currentResidence, setCurrentResidence] = useState<string>('');
  const [biography, setBiography] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showPresetAvatars, setShowPresetAvatars] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetPerson = allPersons.find((p) => p.id === targetPersonId);

  // Update generation and branch automatically when target person or relation type changes
  const handleRelationTypeChange = (type: 'CHILD' | 'SPOUSE' | 'PARENT' | 'INDEPENDENT') => {
    setRelationType(type);
    if (!targetPerson) return;

    if (type === 'CHILD') {
      setGeneration(targetPerson.generation + 1);
      setBranchName(targetPerson.branchName);
      setGender('MALE');
      setOrderInFamily('Trưởng nam');
    } else if (type === 'SPOUSE') {
      setGeneration(targetPerson.generation);
      setBranchName(targetPerson.branchName);
      setGender(targetPerson.gender === 'MALE' ? 'FEMALE' : 'MALE');
      setOrderInFamily(targetPerson.gender === 'MALE' ? 'Chính thất (Vợ cả)' : 'Chồng');
    } else if (type === 'PARENT') {
      setGeneration(Math.max(1, targetPerson.generation - 1));
      setBranchName(targetPerson.branchName);
      setGender('MALE');
      setOrderInFamily('Cha ruột');
    }
  };

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

    const newPersonId = `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newPerson: Person = {
      id: newPersonId,
      treeId,
      fullName: fullName.trim(),
      courtesyName: courtesyName.trim() || undefined,
      gender,
      generation,
      branchName,
      status,
      isLineage: relationType !== 'SPOUSE',
      orderInFamily: orderInFamily || undefined,
      birthYear: calculatedBirthYear,
      solarBirthDate: finalSolarBirthDate,
      lunarBirthDate: lunarBirthDate.trim() || undefined,
      deathYear: status === 'DECEASED' ? calculatedDeathYear : undefined,
      solarDeathDate: status === 'DECEASED' ? finalSolarDeathDate : undefined,
      lunarDeathDate: status === 'DECEASED' && lunarDeathDate ? lunarDeathDate.trim() : undefined,
      lunarDeathCanChi: status === 'DECEASED' && lunarDeathCanChi ? lunarDeathCanChi.trim() : undefined,
      tombLocation: status === 'DECEASED' && tombLocation ? tombLocation : undefined,
      currentResidence: currentResidence || undefined,
      biography: biography.trim() || undefined,
      avatarUrl:
        avatarUrl.trim() ||
        (gender === 'MALE' ? PRESET_AVATARS[0].url : PRESET_AVATARS[1].url),
    };

    let newRelationship: Relationship | undefined;
    if (targetPerson && relationType === 'CHILD') {
      newRelationship = {
        id: `rel-${Date.now()}`,
        treeId,
        type: 'BIOLOGICAL_PARENT',
        fromPersonId: targetPerson.id,
        toPersonId: newPersonId,
      };
    } else if (targetPerson && relationType === 'PARENT') {
      newRelationship = {
        id: `rel-${Date.now()}`,
        treeId,
        type: 'BIOLOGICAL_PARENT',
        fromPersonId: newPersonId,
        toPersonId: targetPerson.id,
      };
    } else if (targetPerson && relationType === 'SPOUSE') {
      newRelationship = {
        id: `rel-${Date.now()}`,
        treeId,
        type: 'MARRIAGE',
        fromPersonId: targetPerson.id,
        toPersonId: newPersonId,
        marriageOrder: 1,
      };
    }

    onMemberAdded(newPerson, newRelationship);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5C378]/20 border border-[#E5C378]/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#E5C378]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg tracking-wide">
                Thêm Thành Viên Vào Phả Đồ
              </h2>
              <p className="text-xs text-[#E5C378]/90">
                Ghi chép thông tin đinh/liệt nữ và nối kết quan hệ huyết thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Relation Type Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. Mối quan hệ huyết thống gia tộc:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleRelationTypeChange('CHILD')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  relationType === 'CHILD'
                    ? 'bg-[#8B2E2E] text-white border-[#8B2E2E] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                Thêm Con
              </button>

              <button
                type="button"
                onClick={() => handleRelationTypeChange('SPOUSE')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  relationType === 'SPOUSE'
                    ? 'bg-[#8B2E2E] text-white border-[#8B2E2E] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Vợ / Chồng
              </button>

              <button
                type="button"
                onClick={() => handleRelationTypeChange('PARENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  relationType === 'PARENT'
                    ? 'bg-[#8B2E2E] text-white border-[#8B2E2E] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Thêm Cha/Mẹ
              </button>

              <button
                type="button"
                onClick={() => handleRelationTypeChange('INDEPENDENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  relationType === 'INDEPENDENT'
                    ? 'bg-[#8B2E2E] text-white border-[#8B2E2E] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Tự Do
              </button>
            </div>
          </div>

          {/* Target Person Select */}
          {relationType !== 'INDEPENDENT' && (
            <div className="bg-white border border-[#E5DAC0] p-3.5 rounded-xl">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {relationType === 'CHILD' && 'Chọn Cha hoặc Mẹ:'}
                {relationType === 'SPOUSE' && 'Chọn Người Phối Ngẫu (Vợ/Chồng):'}
                {relationType === 'PARENT' && 'Chọn Người Con:'}
              </label>
              <select
                value={targetPersonId}
                onChange={(e) => setTargetPersonId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
              >
                {allPersons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} (Đời {p.generation} - {p.branchName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Member Core Info */}
          <div className="bg-white border border-[#E5DAC0] p-4 rounded-xl space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#8B2E2E] border-b border-stone-200 pb-2 flex items-center justify-between">
              <span>2. Thông Tin Nhân Thân</span>
              <span className="text-[11px] font-normal text-stone-500">Kèm ảnh chân dung</span>
            </h3>

            {/* Avatar Section */}
            <div className="p-3 bg-[#FAF7EE] border border-[#E5DAC0] rounded-xl flex flex-col sm:flex-row items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-heritage-gold shadow-xs bg-white flex items-center justify-center font-serif text-xl font-bold text-[#8B2E2E]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{fullName ? fullName.charAt(0).toUpperCase() : 'T'}</span>
                  )}
                </div>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-0.5 rounded-full shadow-xs"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
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
                    className="px-3 py-1.5 bg-[#8B2E2E] hover:bg-[#6E2222] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3 h-3 text-[#E5C378]" />
                    Tải Ảnh Từ Máy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPresetAvatars(!showPresetAvatars)}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    {showPresetAvatars ? 'Đóng Ảnh Mẫu' : 'Chọn Ảnh Mẫu'}
                  </button>
                </div>

                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Hoặc dán link URL ảnh..."
                  className="w-full p-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#8B2E2E]"
                />
              </div>
            </div>

            {/* Presets Grid */}
            {showPresetAvatars && (
              <div className="p-2.5 bg-white border border-stone-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      setShowPresetAvatars(false);
                    }}
                    className={`p-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1.5 bg-stone-50 hover:bg-amber-50 ${
                      avatarUrl === preset.url ? 'border-[#8B2E2E] ring-1 ring-[#8B2E2E]' : 'border-stone-200'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <span className="text-[10px] font-medium text-stone-700 truncate">{preset.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Họ và Tên đầy đủ: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Trọng An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên chữ / Tên tự / Tên húy:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đoan Nhã Tiên Sinh"
                  value={courtesyName}
                  onChange={(e) => setCourtesyName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Giới tính:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800"
                >
                  <option value="MALE">Nam (Đinh)</option>
                  <option value="FEMALE">Nữ (Liệt nữ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Đời thứ:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={generation}
                  onChange={(e) => setGeneration(Number(e.target.value))}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Trạng thái:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LifeStatus)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800"
                >
                  <option value="LIVING">Còn sống</option>
                  <option value="DECEASED">Đã mất (Quy tiên)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Thứ bậc:</label>
                <input
                  type="text"
                  placeholder="Trưởng nam..."
                  value={orderInFamily}
                  onChange={(e) => setOrderInFamily(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs text-stone-800"
                />
              </div>
            </div>

            {/* KHỐI NGÀY / NĂM SINH: CÁC CỤ VS CON CHÁU */}
            <div className="bg-[#FAF7EE] p-3 rounded-xl border border-[#D5C7A9] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-1.5">
                <label className="text-xs font-bold text-[#8B2E2E] flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5" />
                  Ngày / Năm Sinh
                </label>
                
                <div className="flex items-center p-0.5 bg-white border border-stone-300 rounded-lg text-[10.5px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setBirthDateMode('YEAR_ONLY')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      birthDateMode === 'YEAR_ONLY'
                        ? 'bg-[#8B2E2E] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    📜 Chỉ nhớ năm sinh (Các cụ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBirthDateMode('FULL_DATE')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      birthDateMode === 'FULL_DATE'
                        ? 'bg-[#8B2E2E] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    📅 Đầy đủ Ngày - Tháng - Năm (Con cháu)
                  </button>
                </div>
              </div>

              {birthDateMode === 'YEAR_ONLY' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Năm sinh (Dương lịch):</label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 1912, 1945..."
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full sm:w-48 p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
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
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Ngày sinh Âm lịch (tùy chọn):
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 15/07 Âm lịch"
                      value={lunarBirthDate}
                      onChange={(e) => setLunarBirthDate(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Chi / Cành nhánh:
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đời thứ:
                </label>
                <input
                  type="number"
                  min={1}
                  value={generation}
                  onChange={(e) => setGeneration(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                />
              </div>
            </div>

            {/* Death details if Deceased */}
            {status === 'DECEASED' && (
              <div className="p-3 bg-[#FAF4EB] border border-[#C49A45]/40 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-1.5">
                  <div className="text-xs font-bold text-[#8B2E2E] flex items-center gap-1.5 uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    Thông tin Hậu sự & Ngày Giỗ
                  </div>
                  <div className="flex items-center p-0.5 bg-white border border-stone-300 rounded-lg text-[10px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setDeathDateMode('YEAR_ONLY')}
                      className={`px-2 py-0.5 rounded transition-all ${
                        deathDateMode === 'YEAR_ONLY' ? 'bg-[#8B2E2E] text-white' : 'text-stone-600'
                      }`}
                    >
                      Chỉ nhớ năm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeathDateMode('FULL_DATE')}
                      className={`px-2 py-0.5 rounded transition-all ${
                        deathDateMode === 'FULL_DATE' ? 'bg-[#8B2E2E] text-white' : 'text-stone-600'
                      }`}
                    >
                      Đầy đủ ngày tháng
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {deathDateMode === 'YEAR_ONLY' ? (
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Năm mất:</label>
                      <input
                        type="number"
                        placeholder="Ví dụ: 2018"
                        value={deathYear}
                        onChange={(e) => setDeathYear(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">Ngày mất (Dương lịch):</label>
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
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Ngày giỗ âm lịch:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 18/07 Âm lịch"
                      value={lunarDeathDate}
                      onChange={(e) => setLunarDeathDate(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Năm Can Chi:</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Mậu Tuất..."
                      value={lunarDeathCanChi}
                      onChange={(e) => setLunarDeathCanChi(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Mộ phần / Vĩnh hằng:</label>
                    <input
                      type="text"
                      placeholder="Khu lăng mộ Cổ Đô..."
                      value={tombLocation}
                      onChange={(e) => setTombLocation(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nơi ở hiện tại / Nguyên quán:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Xã Cổ Đô, Ba Vì, Hà Nội"
                value={currentResidence}
                onChange={(e) => setCurrentResidence(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tiểu sử tóm tắt / Sự nghiệp:
              </label>
              <textarea
                rows={2}
                placeholder="Ghi lại công trạng, đóng góp cho dòng họ hoặc học vấn..."
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-800"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#E5C378]" />
              Lưu Vào Cây Phả Hệ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
