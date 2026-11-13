import React, { useState } from 'react';
import { FamilyTreeInfo } from '../../types/genealogy';
import { 
  X, Building2, KeyRound, PlusCircle, CheckCircle2, 
  ShieldCheck, ArrowRight, Sparkles, Users, Lock, ChevronRight 
} from 'lucide-react';

interface ClanWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTree: FamilyTreeInfo;
  availableTrees: FamilyTreeInfo[];
  onSelectTree: (tree: FamilyTreeInfo) => void;
  onCreateTree: (treeData: { name: string; ancestralHall: string; originPlace: string; foundedYear: number; coupletText: string }) => void;
  onJoinByCode: (inviteCode: string) => boolean;
}

export const ClanWorkspaceModal: React.FC<ClanWorkspaceModalProps> = ({
  isOpen,
  onClose,
  currentTree,
  availableTrees,
  onSelectTree,
  onCreateTree,
  onJoinByCode,
}) => {
  const [activeTab, setActiveTab] = useState<'my_clans' | 'join_by_code' | 'create_clan'>('my_clans');

  // Join by code state
  const [inviteCode, setInviteCode] = useState<string>('');
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create clan state
  const [clanName, setClanName] = useState<string>('');
  const [ancestralHall, setAncestralHall] = useState<string>('');
  const [originPlace, setOriginPlace] = useState<string>('');
  const [foundedYear, setFoundedYear] = useState<number>(1800);
  const [coupletText, setCoupletText] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    setJoinSuccess(null);

    if (!inviteCode.trim()) {
      setJoinError('Vui lòng nhập mã mời gia tộc.');
      return;
    }

    const success = onJoinByCode(inviteCode.trim());
    if (success) {
      setJoinSuccess(`Tham gia thành công vào dòng họ với mã "${inviteCode.toUpperCase()}"! Bạn đã được cấp quyền truy cập.`);
      setInviteCode('');
    } else {
      setJoinError('Mã mời không hợp lệ hoặc đã hết hạn sử dụng. Vui lòng liên hệ Trưởng Tộc.');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clanName.trim()) return;

    onCreateTree({
      name: clanName.trim(),
      ancestralHall: ancestralHall.trim() || `Từ Đường ${clanName.trim()}`,
      originPlace: originPlace.trim() || 'Việt Nam',
      foundedYear: Number(foundedYear) || 1800,
      coupletText: coupletText.trim() || 'Mộc xuất thiên chi do hữu bản – Thủy lưu vạn phái tổng đồng nguyên',
    });

    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-heritage-border overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-heritage-gold/20 border border-heritage-gold/40 flex items-center justify-center text-heritage-goldLight">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Quản Trị Không Gian Dòng Họ (Multi-Tenancy)
              </h3>
              <p className="text-xs text-amber-200/90">
                Chuyển đổi dòng họ, tham gia bằng mã chia sẻ hoặc khởi tạo cây gia phả mới
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-heritage-border bg-heritage-parchment/60 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('my_clans'); setJoinError(null); }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'my_clans'
                ? 'bg-white text-heritage-crimson shadow-sm border border-heritage-border'
                : 'text-heritage-inkMuted hover:text-heritage-ink hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4 text-heritage-gold" />
            Dòng Họ Của Tôi ({availableTrees.length})
          </button>

          <button
            onClick={() => { setActiveTab('join_by_code'); setJoinError(null); }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'join_by_code'
                ? 'bg-white text-heritage-crimson shadow-sm border border-heritage-border'
                : 'text-heritage-inkMuted hover:text-heritage-ink hover:bg-white/50'
            }`}
          >
            <KeyRound className="w-4 h-4 text-emerald-600" />
            Nhập Mã Mời / Link Chia Sẻ
          </button>

          <button
            onClick={() => { setActiveTab('create_clan'); setJoinError(null); }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'create_clan'
                ? 'bg-white text-heritage-crimson shadow-sm border border-heritage-border'
                : 'text-heritage-inkMuted hover:text-heritage-ink hover:bg-white/50'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-heritage-crimson" />
            Tạo Cây Gia Phả Mới
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: MY CLANS LIST */}
          {activeTab === 'my_clans' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                💡 <strong>Cơ chế phân quyền đa dòng họ:</strong> Một tài khoản có thể tham gia nhiều dòng họ khác nhau (bên Nội, bên Ngoại). Với mỗi dòng họ, bạn sẽ có vai trò độc lập: <em>Trưởng Tộc (Toàn quyền)</em>, <em>Biên Tập Viên (Được sửa)</em> hoặc <em>Thành Viên (Chỉ xem)</em>.
              </div>

              <div className="space-y-2.5">
                {availableTrees.map((tree) => {
                  const isCurrent = tree.id === currentTree.id;
                  return (
                    <div
                      key={tree.id}
                      onClick={() => {
                        onSelectTree(tree);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isCurrent
                          ? 'border-heritage-crimson bg-[#FDF9F9] shadow-sm'
                          : 'border-heritage-border bg-white hover:border-heritage-gold hover:shadow'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-heritage-crimson text-white shadow-md'
                            : 'bg-heritage-parchment text-heritage-crimson border border-heritage-gold/40'
                        }`}>
                          {tree.name.charAt(0) || 'GP'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-sm text-heritage-ink truncate">
                              {tree.name}
                            </h4>
                            {isCurrent && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-heritage-inkMuted truncate mt-0.5">
                            {tree.ancestralHall} • {tree.originPlace} • Khởi lập: {tree.foundedYear}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-1 rounded font-semibold border border-amber-300">
                          {isCurrent ? 'Trưởng Tộc (Admin)' : 'Thành Viên'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-heritage-inkMuted" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: JOIN BY CODE / LINK */}
          {activeTab === 'join_by_code' && (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed">
                🔒 <strong>Tính năng Bảo Mật & Chia Sẻ Gia Tộc:</strong> Để tránh lộ thông tin nội bộ, một người dùng chỉ có thể vào xem phả đồ nếu được Trưởng tộc gửi <strong>Link chia sẻ</strong> hoặc <strong>Mã Mời Gia Tộc</strong>.
              </div>

              {joinSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{joinSuccess}</span>
                </div>
              )}

              {joinError && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-heritage-ink mb-1">
                  Nhập Mã Mời Gia Tộc (Invite Token):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-heritage-inkMuted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Ví dụ: NGUYEN-CODO-8821 hoặc INV-9938"
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-heritage-border bg-heritage-parchment/30 text-heritage-ink font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                  />
                </div>
                <p className="text-[11px] text-heritage-inkMuted mt-1.5">
                  Mã mời được tạo ra từ chức năng <strong>"Mời Thành Viên"</strong> của Trưởng tộc.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-[11px] text-stone-600">
                <span className="font-bold text-stone-800 block">Mã mời mẫu có sẵn để thử nghiệm:</span>
                <div className="flex items-center gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setInviteCode('NGUYEN-CODO-8821')}
                    className="px-2 py-0.5 bg-white border border-stone-300 rounded hover:bg-stone-100 text-heritage-crimson font-bold"
                  >
                    NGUYEN-CODO-8821
                  </button>
                  <span>(Quyền Thành Viên Chi Trưởng)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setInviteCode('TRAN-THIENTRUONG-7712')}
                    className="px-2 py-0.5 bg-white border border-stone-300 rounded hover:bg-stone-100 text-heritage-crimson font-bold"
                  >
                    TRAN-THIENTRUONG-7712
                  </button>
                  <span>(Quyền Biên Tập Viên Họ Trần)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Xác Thực Mã & Mở Khóa Dòng Họ
              </button>
            </form>
          )}

          {/* TAB 3: CREATE NEW CLAN */}
          {activeTab === 'create_clan' && (
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                👑 <strong>Khởi tạo dòng họ mới:</strong> Bạn sẽ tự động trở thành <strong>Trưởng Tộc / Quản Trị Viên (OWNER)</strong> của cây phả hệ này, có toàn quyền thêm con cháu, phân quyền và tạo link mời cho người thân.
              </div>

              {createSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Đã khởi tạo cây gia phả mới thành công! Đang chuyển hướng...
                </div>
              )}

              <div>
                <label className="block font-bold text-heritage-ink mb-1">
                  Tên Dòng Họ: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gia Phả Họ Trần – Phủ Thiên Trường"
                  value={clanName}
                  onChange={(e) => setClanName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-heritage-border bg-white text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-heritage-ink mb-1">
                    Nhà Thờ Tổ / Từ Đường:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Từ Đường Trần Tộc"
                    value={ancestralHall}
                    onChange={(e) => setAncestralHall(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-heritage-border bg-white text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                  />
                </div>
                <div>
                  <label className="block font-bold text-heritage-ink mb-1">
                    Quê Quán Khởi Phát:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Huyện Mỹ Lộc, Tỉnh Nam Định"
                    value={originPlace}
                    onChange={(e) => setOriginPlace(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-heritage-border bg-white text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-heritage-ink mb-1">
                    Năm Khởi Dựng / Định Cư:
                  </label>
                  <input
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-heritage-border bg-white text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                  />
                </div>
                <div>
                  <label className="block font-bold text-heritage-ink mb-1">
                    Câu Đối / Tộc Huấn Truyền Thống:
                  </label>
                  <input
                    type="text"
                    placeholder="Mộc xuất thiên chi do hữu bản..."
                    value={coupletText}
                    onChange={(e) => setCoupletText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-heritage-border bg-white text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-crimson"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4 text-heritage-goldLight" />
                Khởi Tạo Cây Phả Hệ Mới
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
