import React, { useState } from 'react';
import { EditProposal, apiService } from '../../services/api';
import { Person } from '../../types/genealogy';
import { X, CheckCircle, XCircle, Clock, Send, ShieldAlert, FileText, UserCheck } from 'lucide-react';

interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  members: Person[];
  proposals: EditProposal[];
  onProposalUpdated: () => void;
  isAdmin?: boolean;
}

export const EditProposalModal: React.FC<EditProposalModalProps> = ({
  isOpen,
  onClose,
  treeId,
  members,
  proposals,
  onProposalUpdated,
  isAdmin = true,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedPersonId, setSelectedPersonId] = useState<string>(members[0]?.id || '');
  const [proposerName, setProposerName] = useState('');
  const [fieldToChange, setFieldToChange] = useState('Nơi an táng');
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  if (!isOpen) return null;

  const handlePersonChange = (id: string) => {
    setSelectedPersonId(id);
    const p = members.find((m) => m.id === id);
    if (p) {
      if (fieldToChange === 'Nơi an táng') setOldValue(p.tombLocation || 'Chưa rõ');
      else if (fieldToChange === 'Ngày mất âm lịch') setOldValue(p.lunarDeathDate || 'Chưa rõ');
      else if (fieldToChange === 'Năm sinh') setOldValue(p.birthYear?.toString() || 'Chưa rõ');
      else if (fieldToChange === 'Nơi cư trú') setOldValue(p.currentResidence || 'Chưa rõ');
      else setOldValue(p.fullName);
    }
  };

  const handleFieldChange = (field: string) => {
    setFieldToChange(field);
    const p = members.find((m) => m.id === selectedPersonId);
    if (p) {
      if (field === 'Nơi an táng') setOldValue(p.tombLocation || 'Chưa rõ');
      else if (field === 'Ngày mất âm lịch') setOldValue(p.lunarDeathDate || 'Chưa rõ');
      else if (field === 'Năm sinh') setOldValue(p.birthYear?.toString() || 'Chưa rõ');
      else if (field === 'Nơi cư trú') setOldValue(p.currentResidence || 'Chưa rõ');
      else setOldValue(p.fullName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposerName || !newValue || !reason) {
      alert('Vui lòng điền đầy đủ thông tin đề xuất và căn cứ chứng minh');
      return;
    }

    try {
      setSubmitting(true);
      const person = members.find((m) => m.id === selectedPersonId);
      await apiService.submitProposal(treeId, {
        personId: selectedPersonId,
        personName: person?.fullName || 'Thành viên dòng họ',
        proposerName,
        fieldToChange,
        oldValue: oldValue || 'Chưa cập nhật',
        newValue,
        reason,
      });
      alert('Đã gửi đề xuất đính chính thành công tới Ban Quản Trị dòng họ!');
      setActiveTab('list');
      onProposalUpdated();
    } catch (err: any) {
      alert(err.message || 'Không thể gửi đề xuất');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (proposalId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiService.reviewProposal(treeId, proposalId, status, reviewNote || 'Đã kiểm tra căn cứ phả ký');
      alert(status === 'APPROVED' ? 'Đã duyệt đề xuất và ghi nhận vào gia phả!' : 'Đã từ chối đề xuất.');
      setReviewNote('');
      onProposalUpdated();
    } catch (err: any) {
      alert(err.message || 'Lỗi kiểm duyệt đề xuất');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#8B2E2E] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-[#E5C378]" />
            <div>
              <h2 className="text-xl font-bold font-serif">Đóng Góp & Kiểm Duyệt Gia Phả</h2>
              <p className="text-xs text-white/80">Cộng đồng con cháu đề xuất đính chính – Ban Trị Sự phê duyệt lưu chiểu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D5C7A9] bg-[#F3ECE0] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'list'
                ? 'bg-[#FAF7EE] text-[#8B2E2E] border-t-2 border-[#8B2E2E] shadow-sm'
                : 'text-stone-600 hover:text-[#8B2E2E]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Hồ Sơ Đề Xuất ({proposals.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-[#FAF7EE] text-[#8B2E2E] border-t-2 border-[#8B2E2E] shadow-sm'
                : 'text-stone-600 hover:text-[#8B2E2E]'
            }`}
          >
            <Send className="w-4 h-4" />
            Gửi Đề Xuất Đính Chính Mới
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {proposals.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <UserCheck className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                  <p className="font-serif text-base">Chưa có đề xuất chỉnh sửa nào đang chờ xử lý.</p>
                  <p className="text-xs">Con cháu có thể gửi đề xuất nếu phát hiện thông tin chưa chính xác.</p>
                </div>
              ) : (
                proposals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white border border-[#E5DAC0] rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-[#8B2E2E] text-base">
                            {item.personName}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full font-medium">
                            Trường: {item.fieldToChange}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Đề xuất bởi: <strong className="text-stone-700">{item.proposerName}</strong> • {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                            <Clock className="w-3.5 h-3.5" /> Chờ Ban Trị Sự duyệt
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                            <CheckCircle className="w-3.5 h-3.5" /> Đã Phê Duyệt
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-800 rounded-full border border-rose-300">
                            <XCircle className="w-3.5 h-3.5" /> Từ Chối
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Diff comparison box */}
                    <div className="grid grid-cols-2 gap-3 my-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                      <div>
                        <span className="text-stone-400 block mb-1 font-semibold uppercase">Thông tin hiện tại:</span>
                        <div className="text-rose-900 bg-rose-50/70 p-2 rounded border border-rose-200/50">
                          {item.oldValue || '—'}
                        </div>
                      </div>
                      <div>
                        <span className="text-emerald-700 block mb-1 font-semibold uppercase">Đề xuất cập nhật:</span>
                        <div className="text-emerald-950 bg-emerald-50/70 p-2 rounded border border-emerald-300/60 font-semibold">
                          {item.newValue}
                        </div>
                      </div>
                    </div>

                    {/* Reason & Citations */}
                    <div className="text-xs text-stone-600 bg-[#FAF7EE] p-2.5 rounded border border-[#E5DAC0]">
                      <strong className="text-[#8B2E2E]">Căn cứ & Lý do:</strong> {item.reason}
                    </div>

                    {item.reviewerNote && (
                      <div className="mt-2 text-xs text-stone-500 italic">
                        Ý kiến Ban Quản Trị: "{item.reviewerNote}"
                      </div>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && item.status === 'PENDING' && (
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                        <input
                          type="text"
                          placeholder="Ghi chú thẩm tra (tùy chọn)..."
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          className="text-xs border border-stone-300 rounded px-2.5 py-1 flex-1 focus:outline-[#8B2E2E]"
                        />
                        <button
                          onClick={() => handleReview(item.id, 'REJECTED')}
                          className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-colors"
                        >
                          Từ Chối
                        </button>
                        <button
                          onClick={() => handleReview(item.id, 'APPROVED')}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-sm transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Phê Duyệt Lưu Phả
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Quy chế gia tộc:</strong> Mọi thông tin đính chính đều cần dẫn chứng minh bạch (ảnh chụp văn bia, trích lục hộ tịch, sắc phong hoặc đối chiếu từ đường). Ban Trị Sự sẽ thẩm định kỹ trước khi ghi nhận chính thức vào bản Phả Ký.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chọn thành viên cần đính chính:
                  </label>
                  <select
                    value={selectedPersonId}
                    onChange={(e) => handlePersonChange(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 bg-white focus:outline-[#8B2E2E]"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} {m.courtesyName ? `(${m.courtesyName})` : ''} - Đời {m.generation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Trường thông tin cần sửa:
                  </label>
                  <select
                    value={fieldToChange}
                    onChange={(e) => handleFieldChange(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 bg-white focus:outline-[#8B2E2E]"
                  >
                    <option value="Nơi an táng">Nơi an táng / Mộ phần</option>
                    <option value="Ngày mất âm lịch">Ngày mất âm lịch (Ngày giỗ)</option>
                    <option value="Năm sinh">Năm sinh</option>
                    <option value="Họ và tên chữ Hán / Tự">Họ tên húy / Tên chữ</option>
                    <option value="Nơi cư trú">Nơi cư trú / Quê quán</option>
                    <option value="Học hàm / Công trạng">Công trạng / Quan chức xưa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Giá trị hiện tại đang ghi:
                </label>
                <input
                  type="text"
                  readOnly
                  value={oldValue}
                  className="w-full text-sm border border-stone-200 bg-stone-100 rounded-lg p-2.5 text-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Giá trị mới đề xuất đính chính (*):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập thông tin chính xác..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full text-sm border border-[#C49A45] rounded-lg p-2.5 bg-white focus:outline-[#8B2E2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Họ tên người đề xuất & Vai vế (*):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Nam (Cháu nội cụ Hòa)"
                    value={proposerName}
                    onChange={(e) => setProposerName(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 bg-white focus:outline-[#8B2E2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Căn cứ chứng minh (*):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Theo văn bia khắc năm 1823 tại nhà thờ họ"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded-lg p-2.5 bg-white focus:outline-[#8B2E2E]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#8B2E2E] hover:bg-[#732424] rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Đang gửi...' : 'Gửi Đề Xuất Tới Ban Trị Sự'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
