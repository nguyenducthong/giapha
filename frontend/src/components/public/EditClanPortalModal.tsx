import React, { useState, useEffect } from 'react';
import { FamilyTreeInfo } from '../../types/genealogy';
import { 
  X, Save, Building2, MapPin, History, Sparkles, 
  Landmark, BookOpen, Users, Phone, Mail 
} from 'lucide-react';

interface EditClanPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeInfo: FamilyTreeInfo;
  onSave: (updatedTree: FamilyTreeInfo) => void;
}

export const EditClanPortalModal: React.FC<EditClanPortalModalProps> = ({
  isOpen,
  onClose,
  treeInfo,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [coupletText, setCoupletText] = useState('');
  const [ancestralHall, setAncestralHall] = useState('');
  const [originPlace, setOriginPlace] = useState('');
  const [foundedYear, setFoundedYear] = useState<string>('');
  const [historySummary, setHistorySummary] = useState('');
  const [ancestorName, setAncestorName] = useState('');
  const [patriarchName, setPatriarchName] = useState('');
  const [branchesCount, setBranchesCount] = useState<number>(2);
  const [totalGenerations, setTotalGenerations] = useState<number>(4);

  useEffect(() => {
    if (treeInfo) {
      setName(treeInfo.name || '');
      setCoupletText(treeInfo.coupletText || '');
      setAncestralHall(treeInfo.ancestralHall || '');
      setOriginPlace(treeInfo.originPlace || '');
      setFoundedYear(treeInfo.foundedYear ? String(treeInfo.foundedYear) : '');
      setHistorySummary(treeInfo.historySummary || '');
      setAncestorName(treeInfo.ancestorName || '');
      setPatriarchName(treeInfo.patriarchName || '');
      setBranchesCount(treeInfo.branchesCount || 2);
      setTotalGenerations(treeInfo.totalGenerations || 4);
    }
  }, [treeInfo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên dòng họ!');
      return;
    }

    const updated: FamilyTreeInfo = {
      ...treeInfo,
      name: name.trim(),
      coupletText: coupletText.trim(),
      ancestralHall: ancestralHall.trim(),
      originPlace: originPlace.trim(),
      foundedYear: foundedYear ? parseInt(foundedYear, 10) : treeInfo.foundedYear,
      historySummary: historySummary.trim(),
      ancestorName: ancestorName.trim(),
      patriarchName: patriarchName.trim(),
      branchesCount: Number(branchesCount) || treeInfo.branchesCount,
      totalGenerations: Number(totalGenerations) || treeInfo.totalGenerations,
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
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Chỉnh Sửa Trang Giới Thiệu Dòng Họ
              </h3>
              <p className="text-[11px] text-heritage-goldLight">
                Cập nhật thông điệp cội nguồn, nhà thờ tổ và lược sử phả ký
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* PHẦN 1: TÊN & CÂU ĐỐI */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <Sparkles className="w-4 h-4 text-heritage-gold" />
              1. Tiêu Đề Dòng Tộc & Tôn Chỉ
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Tên dòng họ hiển thị <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Gia Phả Họ Nguyễn – Phủ Ba Vì"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Câu đối cội nguồn / Tôn chỉ dòng tộc:
                </label>
                <input
                  type="text"
                  value={coupletText}
                  onChange={(e) => setCoupletText(e.target.value)}
                  placeholder="Ví dụ: Tổ tông công đức thiên niên thịnh – Tử hiếu tôn hiền vạn đại vinh"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson italic font-serif"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 2: ĐỊA ĐIỂM & NĂM KHỞI DỰNG */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <Landmark className="w-4 h-4 text-heritage-moss" />
              2. Nhà Thờ Tổ & Địa Linh Nguồn Cội
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nhà thờ tổ / Từ đường:
                </label>
                <input
                  type="text"
                  value={ancestralHall}
                  onChange={(e) => setAncestralHall(e.target.value)}
                  placeholder="Ví dụ: Từ Đường Cổ Đô – Ba Vì"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Quê quán / Nguyên quán:
                </label>
                <input
                  type="text"
                  value={originPlace}
                  onChange={(e) => setOriginPlace(e.target.value)}
                  placeholder="Ví dụ: Cổ Đô, Ba Vì, Hà Nội"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Năm khởi dựng (Năm bắt đầu phả hệ):
                </label>
                <input
                  type="number"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  placeholder="Ví dụ: 1682"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Số lượng chi cành lớn:
                </label>
                <input
                  type="number"
                  min={1}
                  value={branchesCount}
                  onChange={(e) => setBranchesCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 3: LƯỢC SỬ & BẬC TIÊN TỔ */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-heritage-crimson uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
              <BookOpen className="w-4 h-4 text-heritage-crimson" />
              3. Lược Sử & Bậc Khai Sáng Dòng Tộc
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đức Thủy Tổ Khai Sáng:
                </label>
                <input
                  type="text"
                  value={ancestorName}
                  onChange={(e) => setAncestorName(e.target.value)}
                  placeholder="Ví dụ: Cụ Nguyễn Phúc An (Đời 1)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Trưởng Tộc Đương Nhiệm:
                </label>
                <input
                  type="text"
                  value={patriarchName}
                  onChange={(e) => setPatriarchName(e.target.value)}
                  placeholder="Ví dụ: Ông Nguyễn Văn Đức (Đời 4)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Lược sử & Phả ký tóm tắt dòng họ:
                </label>
                <textarea
                  rows={4}
                  value={historySummary}
                  onChange={(e) => setHistorySummary(e.target.value)}
                  placeholder="Nhập nguồn gốc, hành trình phát triển và những cột mốc thiêng liêng của dòng họ..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-heritage-crimson leading-relaxed"
                />
              </div>
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
            Lưu Cập Nhật Giới Thiệu
          </button>
        </div>
      </div>
    </div>
  );
};
