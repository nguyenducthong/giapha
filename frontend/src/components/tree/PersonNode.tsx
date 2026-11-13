import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Person } from '../../types/genealogy';
import { Crown, Sparkles, MapPin, Calendar, Heart, User, Check } from 'lucide-react';

export interface PersonNodeData {
  person: Person;
  spouses?: Person[];
  activePersonId?: string | null;
  searchQuery?: string;
  isSelected?: boolean;
  isMe?: boolean;
  myPersonId?: string | null;
  onSelect?: (person: Person) => void;
  groupSpouses?: boolean;
}

export const PersonNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as PersonNodeData;
  const {
    person,
    spouses = [],
    activePersonId,
    searchQuery = '',
    myPersonId,
    onSelect,
    groupSpouses = true,
  } = nodeData;

  const [activeSpouseIdx, setActiveSpouseIdx] = useState<number>(0);

  const hasSpouses = groupSpouses && spouses && spouses.length > 0;
  const currentSpouse = hasSpouses ? spouses[activeSpouseIdx] || spouses[0] : null;

  // Check search matches
  const q = searchQuery.trim().toLowerCase();
  const primaryMatchesSearch =
    Boolean(q) &&
    (person.fullName.toLowerCase().includes(q) ||
      (person.courtesyName && person.courtesyName.toLowerCase().includes(q)));

  const spouseMatchesSearch =
    Boolean(q) &&
    Boolean(currentSpouse) &&
    (currentSpouse!.fullName.toLowerCase().includes(q) ||
      (currentSpouse!.courtesyName && currentSpouse!.courtesyName.toLowerCase().includes(q)));

  // Auto-switch to matching spouse if search specifically matches a spouse in multi-spouse case
  useEffect(() => {
    if (q && spouses.length > 1) {
      const matchIdx = spouses.findIndex(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          (s.courtesyName && s.courtesyName.toLowerCase().includes(q))
      );
      if (matchIdx !== -1) {
        setActiveSpouseIdx(matchIdx);
      }
    }
  }, [q, spouses]);

  // Also auto-switch spouse tab if an activePersonId matches one of the spouses
  useEffect(() => {
    if (activePersonId && spouses.length > 0) {
      const idx = spouses.findIndex((s) => s.id === activePersonId);
      if (idx !== -1) {
        setActiveSpouseIdx(idx);
      }
    }
  }, [activePersonId, spouses]);

  const isPrimarySelected = activePersonId === person.id;
  const isSpouseSelected = Boolean(currentSpouse && activePersonId === currentSpouse.id);
  const isPrimaryMe = person.id === myPersonId;
  const isSpouseMe = Boolean(currentSpouse && currentSpouse.id === myPersonId);

  const isAncestor = person.generation === 1 || person.titles?.includes('Thủy Tổ');
  const isPatriarch = person.titles?.includes('Trưởng Tộc');

  // Handle single person card (when no spouses or when spouse grouping is disabled)
  if (!hasSpouses) {
    const isMale = person.gender === 'MALE';
    const isDeceased = person.status === 'DECEASED';

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(person);
        }}
        className={`group relative w-[240px] cursor-pointer rounded-xl border-2 transition-all duration-200 shadow-heritage-sm hover:shadow-heritage-md ${
          isPrimaryMe
            ? 'border-emerald-600 ring-4 ring-emerald-500/30 bg-emerald-50/20 scale-105 z-30'
            : isPrimarySelected
            ? 'border-heritage-crimson ring-4 ring-heritage-crimson/25 scale-105 z-30 shadow-lg'
            : primaryMatchesSearch
            ? 'border-amber-500 ring-4 ring-amber-400/40 bg-amber-50/30 scale-105 z-30'
            : isAncestor
            ? 'border-heritage-gold bg-gradient-to-b from-heritage-parchment to-white shadow-gold-glow'
            : isPatriarch
            ? 'border-heritage-gold bg-white'
            : 'border-[#E2D9C8] bg-white hover:border-heritage-goldLight'
        }`}
      >
        {isPrimaryMe && (
          <div className="absolute -top-3 -right-2 z-40 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white flex items-center gap-1 animate-pulse">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            Tôi
          </div>
        )}

        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!w-2.5 !h-2.5 !bg-heritage-gold !border-2 !border-white"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!w-2.5 !h-2.5 !bg-heritage-gold !border-2 !border-white !opacity-60 group-hover:!opacity-100 transition-opacity"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-2.5 !h-2.5 !bg-heritage-gold !border-2 !border-white !opacity-60 group-hover:!opacity-100 transition-opacity"
        />

        {/* Header bar */}
        <div
          className={`flex items-center justify-between px-2.5 py-1 text-[11px] font-medium rounded-t-[10px] ${
            isAncestor
              ? 'bg-heritage-crimson text-white'
              : isPatriarch
              ? 'bg-heritage-gold text-white'
              : isMale
              ? 'bg-[#EBF1ED] text-heritage-moss'
              : 'bg-[#F9ECEC] text-heritage-crimson'
          }`}
        >
          <span className="flex items-center gap-1 font-semibold">
            {isAncestor && <Crown className="w-3 h-3 text-heritage-goldLight" />}
            {isPatriarch && <Sparkles className="w-3 h-3 text-white" />}
            Đời {person.generation}
          </span>
          <span className="truncate max-w-[130px] opacity-90">
            {person.orderInFamily || person.branchName}
          </span>
        </div>

        {/* Body */}
        <div className="p-2.5 flex items-start gap-2.5">
          <div className="relative shrink-0">
            <div
              className={`w-11 h-11 rounded-full overflow-hidden border-2 flex items-center justify-center font-serif text-base font-bold ${
                isAncestor
                  ? 'border-heritage-gold ring-2 ring-heritage-gold/30 bg-heritage-parchment text-heritage-crimson'
                  : isMale
                  ? 'border-heritage-moss/30 bg-[#F2F6F4] text-heritage-moss'
                  : 'border-heritage-crimson/30 bg-[#FAF1F1] text-heritage-crimson'
              }`}
            >
              {person.avatarUrl ? (
                <img
                  src={person.avatarUrl}
                  alt={person.fullName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span>{person.fullName.charAt(0)}</span>
              )}
            </div>

            <span
              title={isDeceased ? `Đã mất (${person.lunarDeathDate || 'Ngày giỗ'})` : 'Còn sống'}
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
                isDeceased ? 'bg-heritage-gold text-white' : 'bg-emerald-500'
              }`}
            >
              {isDeceased && <span className="text-[8px] font-bold">★</span>}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-heritage-ink truncate group-hover:text-heritage-crimson transition-colors">
              {person.fullName}
            </h4>

            {person.courtesyName && (
              <p className="text-[10px] text-heritage-inkMuted italic truncate">
                {person.courtesyName}
              </p>
            )}

            <div className="mt-1 flex items-center gap-1 text-[11px] text-heritage-inkMuted">
              <Calendar className="w-3 h-3 text-heritage-gold shrink-0" />
              <span className="font-mono text-[10.5px]">
                {person.birthYear || '?'}{' '}–{' '}{isDeceased ? person.deathYear || 'Mất' : 'Nay'}
              </span>
            </div>

            {isDeceased && person.lunarDeathDate && (
              <div className="mt-1 flex items-center gap-1 text-[9.5px] font-medium text-heritage-goldMuted bg-heritage-parchment px-1.5 py-0.5 rounded border border-heritage-gold/20 truncate">
                <span className="text-heritage-crimson font-bold">Giỗ:</span>
                <span className="truncate">{person.lunarDeathDate}</span>
              </div>
            )}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!w-2.5 !h-2.5 !bg-heritage-crimson !border-2 !border-white"
        />
      </div>
    );
  }

  // Dual/Couple Card (Spouses Combined in 1 Card)
  const isPrimaryMale = person.gender === 'MALE';
  const isPrimaryDeceased = person.status === 'DECEASED';
  const isSpouseDeceased = currentSpouse?.status === 'DECEASED';

  return (
    <div
      className={`group relative w-[275px] rounded-2xl border-2 transition-all duration-200 bg-white shadow-heritage-md ${
        isPrimarySelected || isSpouseSelected
          ? 'border-heritage-crimson ring-4 ring-heritage-crimson/25 scale-[1.03] z-30 shadow-xl'
          : primaryMatchesSearch || spouseMatchesSearch
          ? 'border-amber-500 ring-4 ring-amber-400/40 bg-amber-50/20 scale-[1.03] z-30'
          : isAncestor
          ? 'border-heritage-gold shadow-gold-glow'
          : 'border-[#D9CEBA] hover:border-heritage-gold'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-heritage-gold !border-2 !border-white"
      />

      {/* Header bar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 text-[11px] font-medium rounded-t-[14px] ${
          isAncestor
            ? 'bg-gradient-to-r from-heritage-crimson to-[#681E1E] text-white'
            : 'bg-gradient-to-r from-stone-800 to-stone-700 text-white'
        }`}
      >
        <span className="flex items-center gap-1 font-bold">
          {isAncestor && <Crown className="w-3 h-3 text-heritage-goldLight" />}
          Đời thứ {person.generation}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-amber-200/90 font-medium truncate max-w-[150px]">
          <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>Vợ Chồng {spouses.length > 1 ? `(${spouses.length} phối ngẫu)` : ''}</span>
        </span>
      </div>

      {/* SECTION 1: Cụ Ông / Thành viên dòng họ chính */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(person);
        }}
        className={`p-2.5 flex items-start gap-2.5 transition-all cursor-pointer rounded-t-lg ${
          isPrimarySelected
            ? 'bg-amber-50/80 border-b-2 border-heritage-crimson shadow-inner'
            : primaryMatchesSearch
            ? 'bg-amber-100/60'
            : 'hover:bg-stone-50'
        }`}
        title="Nhấp để xem hồ sơ và chỉnh sửa thành viên này"
      >
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-full overflow-hidden border-2 flex items-center justify-center font-serif text-base font-bold ${
              isPrimarySelected
                ? 'border-heritage-crimson ring-2 ring-heritage-crimson/40 bg-white text-heritage-crimson'
                : isPrimaryMale
                ? 'border-heritage-moss/40 bg-[#F2F6F4] text-heritage-moss'
                : 'border-heritage-crimson/40 bg-[#FAF1F1] text-heritage-crimson'
            }`}
          >
            {person.avatarUrl ? (
              <img
                src={person.avatarUrl}
                alt={person.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span>{person.fullName.charAt(0)}</span>
            )}
          </div>

          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${
              isPrimaryDeceased ? 'bg-heritage-gold text-white' : 'bg-emerald-500'
            }`}
          >
            {isPrimaryDeceased ? '★' : ''}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4
              className={`text-xs font-bold truncate transition-colors ${
                isPrimarySelected ? 'text-heritage-crimson underline' : 'text-heritage-ink'
              }`}
            >
              {person.fullName}
            </h4>
            {isPrimaryMe && (
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                Tôi
              </span>
            )}
            {primaryMatchesSearch && (
              <span className="bg-amber-500 text-stone-950 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                Khớp
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-heritage-inkMuted mt-0.5">
            <span className="truncate">{person.orderInFamily || (isPrimaryMale ? 'Cụ Ông' : 'Cụ Bà')}</span>
            <span className="font-mono">
              {person.birthYear || '?'}{' '}–{' '}{isPrimaryDeceased ? person.deathYear || 'Mất' : 'Nay'}
            </span>
          </div>

          {isPrimaryDeceased && person.lunarDeathDate && (
            <div className="mt-1 text-[9.5px] text-heritage-goldMuted font-medium truncate">
              <span className="text-heritage-crimson font-bold">Giỗ:</span> {person.lunarDeathDate}
            </div>
          )}
        </div>
      </div>

      {/* SPOUSE DIVIDER & SELECTOR IF MULTIPLE SPOUSES */}
      <div className="px-3 py-1 bg-[#F5EFE3] border-y border-[#E5DAC0] flex items-center justify-between text-[10px]">
        <span className="font-semibold text-stone-700 flex items-center gap-1">
          <Heart className="w-2.5 h-2.5 text-heritage-crimson fill-current" />
          Phối Ngẫu (Hôn Phối):
        </span>

        {spouses.length > 1 ? (
          <div className="flex items-center gap-1">
            {spouses.map((sp, idx) => (
              <button
                key={sp.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSpouseIdx(idx);
                  onSelect?.(sp);
                }}
                className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                  activeSpouseIdx === idx
                    ? 'bg-heritage-crimson text-white shadow-2xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {idx === 0 ? 'Bà Cả' : `Bà ${idx + 1}`}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-stone-500 italic text-[9.5px]">Chính thất (Bà Cả)</span>
        )}
      </div>

      {/* SECTION 2: Cụ Bà / Người Phối Ngẫu */}
      {currentSpouse && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(currentSpouse);
          }}
          className={`p-2.5 flex items-start gap-2.5 transition-all cursor-pointer rounded-b-xl ${
            isSpouseSelected
              ? 'bg-amber-50/90 border-t-2 border-heritage-crimson shadow-inner'
              : spouseMatchesSearch
              ? 'bg-amber-100/60'
              : 'hover:bg-stone-50'
          }`}
          title="Nhấp để xem hồ sơ và chỉnh sửa người phối ngẫu này"
        >
          <div className="relative shrink-0">
            <div
              className={`w-11 h-11 rounded-full overflow-hidden border-2 flex items-center justify-center font-serif text-base font-bold ${
                isSpouseSelected
                  ? 'border-heritage-crimson ring-2 ring-heritage-crimson/40 bg-white text-heritage-crimson'
                  : 'border-heritage-crimson/40 bg-[#FAF1F1] text-heritage-crimson'
              }`}
            >
              {currentSpouse.avatarUrl ? (
                <img
                  src={currentSpouse.avatarUrl}
                  alt={currentSpouse.fullName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span>{currentSpouse.fullName.charAt(0)}</span>
              )}
            </div>

            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${
                isSpouseDeceased ? 'bg-heritage-gold text-white' : 'bg-emerald-500'
              }`}
            >
              {isSpouseDeceased ? '★' : ''}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4
                className={`text-xs font-bold truncate transition-colors ${
                  isSpouseSelected ? 'text-heritage-crimson underline' : 'text-heritage-ink'
                }`}
              >
                {currentSpouse.fullName}
              </h4>
              {isSpouseMe && (
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  Tôi
                </span>
              )}
              {spouseMatchesSearch && (
                <span className="bg-amber-500 text-stone-950 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  Khớp
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-heritage-inkMuted mt-0.5">
              <span className="truncate">
                {currentSpouse.orderInFamily || 'Phối ngẫu'}
              </span>
              <span className="font-mono">
                {currentSpouse.birthYear || '?'}{' '}–{' '}
                {isSpouseDeceased ? currentSpouse.deathYear || 'Mất' : 'Nay'}
              </span>
            </div>

            {isSpouseDeceased && currentSpouse.lunarDeathDate && (
              <div className="mt-1 text-[9.5px] text-heritage-goldMuted font-medium truncate">
                <span className="text-heritage-crimson font-bold">Giỗ:</span>{' '}
                {currentSpouse.lunarDeathDate}
              </div>
            )}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-heritage-crimson !border-2 !border-white"
      />
    </div>
  );
};
