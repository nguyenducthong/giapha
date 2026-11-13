import React, { useState } from 'react';
import { Person, Relationship } from '../../types/genealogy';
import { MediaAsset } from '../../services/api';
import { 
  X, Calendar, MapPin, Award, BookOpen, Users, 
  GitBranch, Heart, ArrowUpRight, Compass, Edit3, Camera,
  ScrollText, Plus, Image as ImageIcon, Link2, Trash2
} from 'lucide-react';

interface MemberProfileDrawerProps {
  person: Person | null;
  allPersons: Person[];
  allRelationships: Relationship[];
  mediaAssets?: MediaAsset[];
  onClose: () => void;
  onSelectPerson: (person: Person) => void;
  onOpenKinshipFinder: (person: Person) => void;
  onAddRelative?: (relativePerson: Person) => void;
  onConnectRelationship?: (person: Person) => void;
  onEditPerson?: (person: Person) => void;
  onDeletePerson?: (person: Person) => Promise<void>;
  onOpenPersonMedia?: (person: Person) => void;
  onUploadPersonMedia?: (person: Person) => void;
  isMe?: boolean;
  onClaimProfile?: (person: Person) => void;
}

export const MemberProfileDrawer: React.FC<MemberProfileDrawerProps> = ({
  person,
  allPersons,
  allRelationships,
  mediaAssets = [],
  onClose,
  onSelectPerson,
  onOpenKinshipFinder,
  onAddRelative,
  onConnectRelationship,
  onEditPerson,
  onDeletePerson,
  onOpenPersonMedia,
  onUploadPersonMedia,
  isMe,
  onClaimProfile,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  if (!person) return null;

  const deletePerson = async () => {
    const count = allRelationships.filter(r => r.fromPersonId === person.id || r.toPersonId === person.id).length;
    if (!onDeletePerson || !window.confirm(`Xóa thành viên ${person.fullName}?\n\nSẽ xóa ${count} quan hệ gắn với người này. Những thành viên khác vẫn được giữ lại. Thao tác này không thể hoàn tác.`)) return;
    setDeleting(true); setDeleteError('');
    try { await onDeletePerson(person); }
    catch (error) { setDeleteError(error instanceof Error ? error.message : 'Không thể xóa thành viên.'); }
    finally { setDeleting(false); }
  };

  const isMale = person.gender === 'MALE';
  const isDeceased = person.status === 'DECEASED';
  const personMedia = mediaAssets.filter((m) => m.relatedPersonId === person.id);

  // Find parents
  const parentRels = allRelationships.filter(
    r => r.type === 'BIOLOGICAL_PARENT' && r.toPersonId === person.id
  );
  const parents = parentRels
    .map(r => allPersons.find(p => p.id === r.fromPersonId))
    .filter((p): p is Person => Boolean(p));

  // Find spouses
  const spouseRels = allRelationships.filter(
    r => r.type === 'MARRIAGE' && (r.fromPersonId === person.id || r.toPersonId === person.id)
  );
  const spouses = spouseRels.map(r => {
    const spouseId = r.fromPersonId === person.id ? r.toPersonId : r.fromPersonId;
    const spousePerson = allPersons.find(p => p.id === spouseId);
    return {
      person: spousePerson,
      order: r.marriageOrder || 1,
    };
  }).filter((s): s is { person: Person; order: number } => Boolean(s.person));

  // Find children
  const childRels = allRelationships.filter(
    r => r.type === 'BIOLOGICAL_PARENT' && r.fromPersonId === person.id
  );
  const children = childRels
    .map(r => allPersons.find(p => p.id === r.toPersonId))
    .filter((p): p is Person => Boolean(p));

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-heritage-border animate-in slide-in-from-right duration-300">
      {/* Drawer Header with traditional styling */}
      <div className="p-4 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="bg-heritage-gold/30 text-heritage-goldLight px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
            Đời thứ {person.generation}
          </span>
          <span className="text-sm font-medium opacity-90 truncate max-w-[200px]">
            {person.branchName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          title="Đóng bảng thông tin"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {onDeletePerson && <div className="border border-red-200 rounded-xl p-3 bg-red-50">
          <button type="button" onClick={deletePerson} disabled={deleting} className="flex items-center gap-2 min-h-11 text-sm font-semibold text-red-800 disabled:opacity-50">
            <Trash2 className="w-4 h-4" />{deleting ? 'Đang xóa...' : 'Xóa thành viên'}
          </button>
          <p className="text-xs text-stone-600">Xóa người này và các đường nối liên quan, giữ lại các thành viên khác.</p>
          {deleteError && <p role="alert" className="mt-2 text-sm text-red-800">{deleteError}</p>}
        </div>}
        {/* Profile Card Summary */}
        <div className="flex items-start gap-4 pb-4 border-b border-heritage-border">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-heritage-gold shadow-md bg-heritage-parchment flex items-center justify-center font-serif text-2xl font-bold text-heritage-crimson">
              {person.avatarUrl ? (
                <img
                  src={person.avatarUrl}
                  alt={person.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{person.fullName.charAt(0)}</span>
              )}
            </div>
            {onEditPerson && (
              <button
                type="button"
                onClick={() => onEditPerson(person)}
                className="absolute -bottom-1 -right-1 bg-stone-900 hover:bg-heritage-crimson text-white p-1.5 rounded-full shadow-md text-xs transition-colors flex items-center justify-center border-2 border-white"
                title="Thay đổi ảnh đại diện thành viên này"
              >
                <Camera className="w-3.5 h-3.5 text-heritage-goldLight" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold font-serif text-heritage-ink">
              {person.fullName}
            </h3>
            {person.courtesyName && (
              <p className="text-sm text-heritage-goldMuted font-medium italic">
                {person.courtesyName}
              </p>
            )}
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isMale ? 'bg-[#EBF1ED] text-heritage-moss' : 'bg-[#F9ECEC] text-heritage-crimson'
              }`}>
                {isMale ? 'Nam' : 'Nữ'}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isDeceased ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDeceased ? 'Đã khuất' : 'Còn sống'}
              </span>
              {!person.isLineage ? (
                <span className="bg-amber-100/90 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  {isMale ? 'Rể họ' : 'Dâu họ'}{person.maternalClanName ? ` (${person.maternalClanName})` : ''}
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Nội tộc
                </span>
              )}
              {person.orderInFamily && (
                <span className="bg-heritage-parchment text-heritage-inkMuted text-xs px-2 py-0.5 rounded border border-heritage-gold/30">
                  {person.orderInFamily}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nút Chỉnh Sửa Thông Tin & Đổi Ảnh Đại Diện */}
        {onEditPerson && (
          <button
            type="button"
            onClick={() => onEditPerson(person)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-amber-700 to-heritage-crimson hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-400/50"
          >
            <Edit3 className="w-4 h-4 text-heritage-goldLight" />
            <span>Chỉnh Sửa Thông Tin & Đổi Ảnh Đại Diện</span>
          </button>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenKinshipFinder(person)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-heritage-moss hover:bg-heritage-mossLight text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Compass className="w-4 h-4" />
            Tra Xưng Hô
          </button>
          {onAddRelative ? (
            <button
              onClick={() => onAddRelative(person)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#8B2E2E] hover:bg-[#6E2222] text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Users className="w-4 h-4 text-[#E5C378]" />
              + Nối Dõi / Phối Ngẫu
            </button>
          ) : (
            <button
              onClick={() => onSelectPerson(person)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-heritage-parchment hover:bg-[#EFE7D3] text-heritage-ink border border-heritage-gold/40 rounded-lg text-xs font-semibold transition-colors"
            >
              <GitBranch className="w-4 h-4 text-heritage-crimson" />
              Định Vị Phả Đồ
            </button>
          )}
        </div>

        {/* Nối quan hệ với thành viên đã có sẵn */}
        {onConnectRelationship && (
          <button
            type="button"
            onClick={() => onConnectRelationship(person)}
            className="w-full py-2 px-3 bg-gradient-to-r from-stone-900 to-[#8B2E2E] hover:brightness-110 text-[#F5D996] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 border border-[#C49A45]/40 cursor-pointer"
            title="Nối người này với một thành viên khác đã có sẵn trên phả đồ"
          >
            <Link2 className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Nối Quan Hệ Với Người Đã Có Sẵn</span>
          </button>
        )}

        {/* Account Claiming / Identity Binding */}
        {isMe ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-amber-900 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">✨ Tài khoản đang liên kết: Chính bạn (Tôi)</span>
            </div>
            <span className="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-medium">
              Chính chủ
            </span>
          </div>
        ) : onClaimProfile && (
          <button
            onClick={() => onClaimProfile(person)}
            className="w-full py-2 px-3 bg-gradient-to-r from-heritage-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 border border-amber-500"
            title="Gán tài khoản đang đăng nhập với thành viên này trên phả đồ"
          >
            <span>📍 Liên Kết Tài Khoản Của Tôi Với Thành Viên Này</span>
          </button>
        )}

        {/* Vital Dates (Sinh - Tử - Lịch Giỗ Âm Lịch) */}
        <div className="bg-heritage-parchment/60 p-3.5 rounded-xl border border-heritage-border space-y-2 text-xs">
          <h4 className="font-bold text-heritage-crimson flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            Năm Sinh & Ngày Kỵ Nhật
          </h4>
          <div className="grid grid-cols-2 gap-2 pt-1 text-heritage-ink">
            <div>
              <span className="text-heritage-inkMuted block">Ngày / Năm sinh:</span>
              <span className="font-semibold text-heritage-ink">
                {person.solarBirthDate
                  ? person.solarBirthDate.includes('-')
                    ? person.solarBirthDate.split('-').reverse().join('/')
                    : person.solarBirthDate
                  : person.birthYear
                  ? `Năm ${person.birthYear}`
                  : 'Chưa rõ'}
              </span>
              {person.lunarBirthDate && (
                <span className="block text-[10.5px] text-heritage-goldMuted font-medium">
                  (ÂL: {person.lunarBirthDate})
                </span>
              )}
            </div>
            <div>
              <span className="text-heritage-inkMuted block">Hưởng thọ / Tạ thế:</span>
              <span className="font-semibold text-heritage-ink">
                {isDeceased
                  ? person.solarDeathDate
                    ? person.solarDeathDate.includes('-')
                      ? person.solarDeathDate.split('-').reverse().join('/')
                      : person.solarDeathDate
                    : person.deathYear
                    ? `Năm ${person.deathYear}`
                    : 'Chưa rõ'
                  : 'Đang hưởng thọ'}
              </span>
            </div>
            {isDeceased && person.lunarDeathDate && (
              <div className="col-span-2 bg-white p-2 rounded border border-heritage-gold/30">
                <span className="text-heritage-crimson font-bold block">Ngày giỗ hằng năm (Lịch Âm):</span>
                <span className="font-semibold text-sm text-heritage-goldMuted">
                  {person.lunarDeathDate}
                  {person.lunarDeathCanChi && ` (Năm ${person.lunarDeathCanChi})`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mộ phần / Vĩnh Hằng Viên */}
        {person.tombLocation && (
          <div className="bg-white p-3.5 rounded-xl border border-heritage-border space-y-1.5 text-xs">
            <h4 className="font-bold text-heritage-moss flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              Nơi An Nghỉ (Mộ Phần)
            </h4>
            <p className="text-heritage-ink font-medium leading-relaxed">
              {person.tombLocation}
            </p>
          </div>
        )}

        {/* Khối Gốc Tích Bên Ngoại & Thân Thế Dâu/Rể */}
        <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF5EB] p-4 rounded-xl border border-amber-300/80 shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Heart className="w-3.5 h-3.5 text-heritage-crimson" />
              Gốc Tích Quê Ngoại & Thân Thế
            </h4>
            <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold ${
              !person.isLineage ? 'bg-amber-200/80 text-amber-900' : 'bg-stone-200 text-stone-700'
            }`}>
              {!person.isLineage ? (isMale ? 'Rể họ' : 'Dâu họ') : 'Họ mẹ (Bên ngoại)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-heritage-ink">
            <div>
              <span className="text-stone-500 block text-[10.5px]">Dòng họ ngoại:</span>
              <span className="font-bold text-stone-900">
                {person.maternalClanName || 'Chưa ghi chép'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block text-[10.5px]">Quê ngoại / Bản quán:</span>
              <span className="font-semibold text-stone-900">
                {person.maternalOriginPlace || person.originPlace || 'Chưa ghi chép'}
              </span>
            </div>
          </div>

          {(person.maternalFather || person.maternalMother) && (
            <div className="pt-1.5 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-heritage-ink">
              {person.maternalFather && (
                <div>
                  <span className="text-stone-500 block text-[10.5px]">Cụ Ông bên ngoại:</span>
                  <span className="font-medium text-stone-800">{person.maternalFather}</span>
                </div>
              )}
              {person.maternalMother && (
                <div>
                  <span className="text-stone-500 block text-[10.5px]">Cụ Bà bên ngoại:</span>
                  <span className="font-medium text-stone-800">{person.maternalMother}</span>
                </div>
              )}
            </div>
          )}

          {person.maternalNotes && (
            <div className="pt-1.5 border-t border-amber-200/60">
              <span className="text-stone-500 block text-[10.5px]">Gia phong & thân thế:</span>
              <p className="text-stone-800 italic leading-relaxed pt-0.5">
                "{person.maternalNotes}"
              </p>
            </div>
          )}

          {!person.maternalClanName && !person.maternalOriginPlace && onEditPerson && (
            <button
              type="button"
              onClick={() => onEditPerson(person)}
              className="mt-1 w-full py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 border border-amber-300/80 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Bổ sung thông tin cội nguồn bên ngoại</span>
            </button>
          )}
        </div>

        {/* Spouses Section */}
        {spouses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-heritage-ink flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-heritage-crimson" />
              Hôn Phối ({spouses.length})
            </h4>
            <div className="space-y-1.5">
              {spouses.map(({ person: sp, order }) => (
                <div
                  key={sp.id}
                  onClick={() => onSelectPerson(sp)}
                  className="flex items-center justify-between p-2 rounded-lg border border-heritage-border hover:bg-heritage-parchment cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-heritage-parchment flex items-center justify-center font-bold text-xs text-heritage-crimson">
                      {sp.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-heritage-ink hover:text-heritage-crimson">
                        {sp.fullName}
                      </p>
                      <span className="text-[10px] text-heritage-goldMuted font-medium">
                        {order === 1 ? 'Chính thất (Bà Cả)' : `Kế thất (${order})`}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-heritage-inkMuted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parents Section */}
        {parents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-heritage-ink flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-heritage-moss" />
              Bậc Sinh Thành ({parents.length})
            </h4>
            <div className="space-y-1.5">
              {parents.map(pr => (
                <div
                  key={pr.id}
                  onClick={() => onSelectPerson(pr)}
                  className="flex items-center justify-between p-2 rounded-lg border border-heritage-border hover:bg-heritage-parchment cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EBF1ED] flex items-center justify-center font-bold text-xs text-heritage-moss">
                      {pr.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-heritage-ink">
                        {pr.fullName}
                      </p>
                      <span className="text-[10px] text-heritage-inkMuted">
                        {pr.gender === 'MALE' ? 'Cha ruột' : 'Mẹ ruột'} (Đời {pr.generation})
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-heritage-inkMuted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children Section */}
        {children.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-heritage-ink flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <GitBranch className="w-3.5 h-3.5 text-heritage-gold" />
              Con Cái ({children.length})
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {children.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => onSelectPerson(ch)}
                  className="flex items-center justify-between p-2 rounded-lg border border-heritage-border hover:bg-heritage-parchment cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-heritage-border flex items-center justify-center font-bold text-xs text-heritage-ink">
                      {ch.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-heritage-ink">
                        {ch.fullName}
                      </p>
                      <span className="text-[10px] text-heritage-inkMuted">
                        {ch.orderInFamily || (ch.gender === 'MALE' ? 'Con trai' : 'Con gái')} (Đời {ch.generation})
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-heritage-inkMuted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biography */}
        {person.biography && (
          <div className="space-y-2">
            <h4 className="font-bold text-heritage-ink flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-heritage-crimson" />
              Tiểu Sử & Phả Ký
            </h4>
            <div className="p-3 bg-heritage-parchment/40 rounded-xl border border-heritage-border text-xs text-heritage-ink leading-relaxed">
              {person.biography}
            </div>
          </div>
        )}

        {/* Achievements / Công trạng */}
        {person.achievements && person.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-heritage-ink flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-heritage-gold" />
              Công Trạng & Danh Hiệu
            </h4>
            <ul className="space-y-1.5">
              {person.achievements.map((ach, idx) => (
                <li
                  key={idx}
                  className="text-xs p-2 bg-white rounded border border-heritage-gold/30 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold"></span>
                  <span className="font-medium text-heritage-ink">{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tư Liệu, Sắc Phong & Di Ảnh Liên Quan */}
        <div className="space-y-2.5 pt-2 border-t border-heritage-border">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-heritage-crimson flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ScrollText className="w-3.5 h-3.5" />
              Tư Liệu & Sắc Phong ({personMedia.length})
            </h4>
            {onUploadPersonMedia && (
              <button
                type="button"
                onClick={() => onUploadPersonMedia(person)}
                className="text-[11px] font-bold text-[#8B2E2E] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Thêm tư liệu
              </button>
            )}
          </div>

          {personMedia.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-heritage-parchment/40 border border-dashed border-heritage-gold/50 text-center space-y-2">
              <ImageIcon className="w-6 h-6 mx-auto text-stone-400 opacity-70" />
              <p className="text-[11px] text-heritage-inkMuted">
                Chưa có ảnh thờ, sắc phong hay văn bia nào gắn với {person.fullName}.
              </p>
              {onUploadPersonMedia && (
                <button
                  type="button"
                  onClick={() => onUploadPersonMedia(person)}
                  className="px-3 py-1.5 rounded-lg bg-[#8B2E2E] text-white text-[11px] font-bold hover:bg-[#6E2222] transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tải lên Sắc phong / Ảnh thờ
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {personMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenPersonMedia && onOpenPersonMedia(person)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white border border-heritage-border hover:border-heritage-gold shadow-2xs cursor-pointer transition-all group"
                >
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    className="w-14 h-11 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-serif font-bold text-heritage-ink group-hover:text-heritage-crimson truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                      <span>Năm: {item.takenYear || 'Cổ truyền'}</span>
                      {item.transcription && (
                        <span className="text-[#8B2E2E] font-semibold">• Có dịch Hán-Nôm</span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-heritage-crimson shrink-0" />
                </div>
              ))}
              {onOpenPersonMedia && (
                <button
                  type="button"
                  onClick={() => onOpenPersonMedia(person)}
                  className="w-full py-1.5 rounded-lg bg-heritage-parchment hover:bg-[#EFE2C8] text-[#8B2E2E] text-xs font-bold border border-heritage-gold/40 transition-colors"
                >
                  Mở Kho Tư Liệu Của {person.fullName} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
