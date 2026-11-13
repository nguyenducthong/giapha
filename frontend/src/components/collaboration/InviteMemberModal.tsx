import React, { useState } from 'react';
import { Person } from '../../types/genealogy';
import { X, UserPlus, Copy, Check, Shield, Users, Mail, Link as LinkIcon, Sparkles, Clock, QrCode } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  clanName: string;
  members: Person[];
  currentRole?: 'OWNER' | 'EDITOR' | 'MEMBER';
}

interface ClanRoleMember {
  id: string;
  name: string;
  branch: string;
  role: 'OWNER' | 'EDITOR' | 'MEMBER';
  joinedDate: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  clanName,
  members,
  currentRole = 'OWNER',
}) => {
  const [activeTab, setActiveTab] = useState<'create_link' | 'member_list'>('create_link');
  const [selectedRole, setSelectedRole] = useState<'EDITOR' | 'MEMBER'>('MEMBER');
  const [selectedBranch, setSelectedBranch] = useState<string>('Chi Trưởng (Ngành 1)');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [quickPromoteName, setQuickPromoteName] = useState<string>('');
  const [quickPromoteRole, setQuickPromoteRole] = useState<'EDITOR' | 'OWNER' | 'MEMBER'>('EDITOR');
  const [promoteNotice, setPromoteNotice] = useState<string | null>(null);

  // Sample clan members with roles
  const [roleMembers, setRoleMembers] = useState<ClanRoleMember[]>([
    {
      id: 'm-01',
      name: 'Nguyễn Trọng Tuyên',
      branch: 'Chi Trưởng',
      role: 'OWNER',
      joinedDate: 'Tháng 01/2024',
    },
    {
      id: 'm-02',
      name: 'Nguyễn Văn Minh',
      branch: 'Chi Hai',
      role: 'EDITOR',
      joinedDate: 'Tháng 03/2024',
    },
    {
      id: 'm-03',
      name: 'Nguyễn Thị Hải Yến',
      branch: 'Chi Hai',
      role: 'MEMBER',
      joinedDate: 'Tháng 06/2024',
    },
  ]);

  if (!isOpen) return null;

  const generatedInviteLink = `https://giaphaviet.vn/join/${clanName.toLowerCase().replace(/\s+/g, '-')}-token-${selectedRole.toLowerCase()}-${expiryDays}d`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setInviteEmail('');
      alert(`Đã gửi thư mời điện tử thành công tới địa chỉ "${inviteEmail}" kèm liên kết tham gia gia tộc!`);
    }, 1000);
  };

  const handleRoleChange = (memberId: string, newRole: 'OWNER' | 'EDITOR' | 'MEMBER') => {
    setRoleMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const roleTitle = newRole === 'OWNER' ? 'Trưởng Tộc (Owner)' : newRole === 'EDITOR' ? 'Biên Tập Viên (Editor)' : 'Thành Viên (Member)';
          setPromoteNotice(`Đã cập nhật quyền của "${m.name}" thành "${roleTitle}"!`);
          setTimeout(() => setPromoteNotice(null), 3500);
          return { ...m, role: newRole };
        }
        return m;
      })
    );
  };

  const handleQuickPromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPromoteName.trim()) return;

    const newMember: ClanRoleMember = {
      id: `m-${Date.now()}`,
      name: quickPromoteName.trim(),
      branch: 'Toàn tộc',
      role: quickPromoteRole,
      joinedDate: 'Vừa xong',
    };

    setRoleMembers((prev) => [newMember, ...prev]);
    const roleTitle = quickPromoteRole === 'OWNER' ? 'Trưởng Tộc (Owner)' : quickPromoteRole === 'EDITOR' ? 'Ban Biên Tập (Editor)' : 'Thành Viên (Member)';
    setPromoteNotice(`Đã cấp quyền "${roleTitle}" cho tài khoản "${quickPromoteName.trim()}" thành công!`);
    setQuickPromoteName('');
    setTimeout(() => setPromoteNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5C378]/20 border border-[#E5C378]/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#E5C378]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg tracking-wide">
                Mời Thành Viên & Phân Quyền Gia Tộc
              </h2>
              <p className="text-xs text-[#E5C378]/90">
                {clanName} • Cơ chế phân quyền RBAC đa chi nhánh
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5DAC0] bg-[#F4EEDC]/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('create_link')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'create_link'
                ? 'border-[#8B2E2E] bg-[#FAF7EE] text-[#8B2E2E] shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Tạo Liên Kết Mời
          </button>

          <button
            onClick={() => setActiveTab('member_list')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'member_list'
                ? 'border-[#8B2E2E] bg-[#FAF7EE] text-[#8B2E2E] shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Quản Trị Thành Viên ({roleMembers.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'create_link' && (
            <div className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  1. Chọn vai trò quyền hạn được cấp khi thành viên tham gia:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedRole('MEMBER')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedRole === 'MEMBER'
                        ? 'border-[#8B2E2E] bg-[#8B2E2E]/5 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#8B2E2E]" />
                        Thành Viên Nội/Ngoại Tộc
                      </span>
                      {selectedRole === 'MEMBER' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8B2E2E]"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Xem toàn bộ cây phả hệ, hồ sơ thành viên, nộp đề xuất đính chính và dâng hương online.
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedRole('EDITOR')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedRole === 'EDITOR'
                        ? 'border-[#8B2E2E] bg-[#8B2E2E]/5 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-700" />
                        Ban Thư Ký / Trưởng Chi
                      </span>
                      {selectedRole === 'EDITOR' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8B2E2E]"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Được chỉnh sửa thông tin thành viên, thêm con cháu mới và quản lý sự kiện trong chi ngành.
                    </p>
                  </div>
                </div>
              </div>

              {/* Expiry and Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Gắn với Chi / Cành:
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                  >
                    <option>Chi Trưởng (Ngành 1)</option>
                    <option>Chi Hai (Ngành 2)</option>
                    <option>Chi Ba (Ngành 3)</option>
                    <option>Toàn Thể Dòng Họ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Thời hạn liên kết:
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                  >
                    <option value={7}>Có giá trị trong 7 ngày</option>
                    <option value={30}>Có giá trị trong 30 ngày</option>
                    <option value={90}>Có giá trị trong 90 ngày</option>
                    <option value={365}>Vĩnh viễn (1 năm)</option>
                  </select>
                </div>
              </div>

              {/* Copyable Link Box */}
              <div className="bg-white border border-[#E5DAC0] p-4 rounded-xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#8B2E2E]" />
                    Đường dẫn mời tham gia:
                  </span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Bảo mật JWT Token
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteLink}
                    className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-700 font-mono truncate select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#8B2E2E] hover:bg-[#6E2222] text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#E5C378]" /> Sao chép link
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Bạn có thể gửi liên kết này vào nhóm Zalo, Facebook hoặc tin nhắn cho bà con họ tộc.
                </p>
              </div>

              {/* Send Direct Email */}
              <form onSubmit={handleSendEmail} className="bg-[#F8F5EC] border border-dashed border-[#C49A45]/50 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8B2E2E]" />
                  Hoặc gửi thư mời điện tử trực tiếp qua Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Nhập email thành viên cần mời (ví dụ: conchau@gmail.com)..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 p-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#8B2E2E]"
                  />
                  <button
                    type="submit"
                    disabled={emailSent}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E5C378]" />
                    {emailSent ? 'Đang gửi...' : 'Gửi Thư'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'member_list' && (
            <div className="space-y-4">
              {/* Form nâng quyền nhanh cho nick mới */}
              <form onSubmit={handleQuickPromote} className="p-3.5 bg-gradient-to-r from-[#FBF8F1] to-white border border-[#C49A45]/40 rounded-xl space-y-2 shadow-xs">
                <div className="font-bold text-xs text-stone-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#8B2E2E]" />
                    Nâng Quyền Cho Tài Khoản Mới Tạo (Theo Tên / Email):
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal">
                    Chỉ Trưởng Tộc mới có quyền này
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên hoặc email tài khoản cần nâng..."
                    value={quickPromoteName}
                    onChange={(e) => setQuickPromoteName(e.target.value)}
                    className="flex-1 min-w-[180px] p-2 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#8B2E2E]"
                  />
                  <select
                    value={quickPromoteRole}
                    onChange={(e) => setQuickPromoteRole(e.target.value as any)}
                    className="p-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-700"
                  >
                    <option value="EDITOR">Nâng lên: Biên Tập Viên (Editor)</option>
                    <option value="OWNER">Nâng lên: Đồng Trưởng Tộc (Owner)</option>
                    <option value="MEMBER">Chuyển thành: Thành Viên (Member)</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] hover:from-[#6E2222] hover:to-[#8B2E2E] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                    Nâng Quyền Ngay
                  </button>
                </div>
                {promoteNotice && (
                  <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-700" />
                    {promoteNotice}
                  </div>
                )}
              </form>

              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Danh sách tài khoản và phân quyền hiện tại trong dòng họ:</span>
                <span className="font-bold text-[#8B2E2E]">Tổng số: {roleMembers.length} người</span>
              </div>

              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs">
                {roleMembers.map((m) => (
                  <div key={m.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B2E2E]/10 border border-[#8B2E2E]/20 flex items-center justify-center font-bold text-xs text-[#8B2E2E]">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-800 flex items-center gap-2">
                          {m.name}
                          {m.role === 'OWNER' && (
                            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                              Trưởng Tộc
                            </span>
                          )}
                          {m.role === 'EDITOR' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              Ban Biên Tập
                            </span>
                          )}
                          {m.role === 'MEMBER' && (
                            <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-semibold">
                              Thành Viên
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {m.branch} • Tham gia: {m.joinedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value as any)}
                        className="p-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-700 font-medium"
                      >
                        <option value="OWNER">Trưởng Tộc (Owner)</option>
                        <option value="EDITOR">Biên Tập (Editor)</option>
                        <option value="MEMBER">Thành Viên (Member)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
