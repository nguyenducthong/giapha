import React, { useState, useEffect } from 'react';
import { Person, Relationship } from '../../types/genealogy';
import {
  X,
  Link2,
  Heart,
  GitBranch,
  ArrowRight,
  User,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ConnectRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPersons: Person[];
  relationships: Relationship[];
  initialPersonA?: Person | null;
  initialPersonB?: Person | null;
  onSaveRelationship: (
    newRel: Relationship,
    updatedPersons?: Person[]
  ) => void;
  onDeleteRelationship: (relationshipId: string) => void;
}

export const ConnectRelationshipModal: React.FC<ConnectRelationshipModalProps> = ({
  isOpen,
  onClose,
  allPersons,
  relationships,
  initialPersonA,
  initialPersonB,
  onSaveRelationship,
  onDeleteRelationship,
}) => {
  const [personAId, setPersonAId] = useState<string>('');
  const [personBId, setPersonBId] = useState<string>('');
  const [relationType, setRelationType] = useState<'MARRIAGE' | 'PARENT_CHILD'>('MARRIAGE');
  const [parentDirection, setParentDirection] = useState<'A_IS_PARENT' | 'B_IS_PARENT'>('A_IS_PARENT');
  const [marriageOrder, setMarriageOrder] = useState<number>(1);
  const [autoSyncGeneration, setAutoSyncGeneration] = useState<boolean>(true);

  // Sync initial persons when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialPersonA) {
        setPersonAId(initialPersonA.id);
      } else if (allPersons.length > 0) {
        setPersonAId(allPersons[0].id);
      }

      if (initialPersonB) {
        setPersonBId(initialPersonB.id);
      } else if (allPersons.length > 1) {
        const firstAId = initialPersonA ? initialPersonA.id : allPersons[0]?.id;
        // Find first person who does NOT already have a relationship with A
        const unconnected = allPersons.find((p) => {
          if (p.id === firstAId) return false;
          const hasRel = relationships.some(
            (r) =>
              (r.fromPersonId === firstAId && r.toPersonId === p.id) ||
              (r.fromPersonId === p.id && r.toPersonId === firstAId)
          );
          return !hasRel;
        });
        if (unconnected) {
          setPersonBId(unconnected.id);
        } else {
          const other = allPersons.find((p) => p.id !== firstAId);
          if (other) setPersonBId(other.id);
        }
      }
    }
  }, [isOpen, initialPersonA, initialPersonB, allPersons, relationships]);

  if (!isOpen) return null;

  const personA = allPersons.find((p) => p.id === personAId);
  const personB = allPersons.find((p) => p.id === personBId);

  // Check if a relationship already exists between Person A and Person B
  const existingRel = relationships.find(
    (r) =>
      (r.fromPersonId === personAId && r.toPersonId === personBId) ||
      (r.fromPersonId === personBId && r.toPersonId === personAId)
  );

  // List existing relationships of Person A for easy management / unlinking
  const personARels = relationships
    .filter((r) => r.fromPersonId === personAId || r.toPersonId === personAId)
    .map((r) => {
      const otherId = r.fromPersonId === personAId ? r.toPersonId : r.fromPersonId;
      const otherPerson = allPersons.find((p) => p.id === otherId);
      let desc = '';
      if (r.type === 'MARRIAGE') {
        desc = `Hôn phối (Vợ/Chồng) • Thứ bậc: ${r.marriageOrder || 1}`;
      } else if (r.fromPersonId === personAId) {
        desc = `Là Cha/Mẹ của ${otherPerson?.fullName || 'Con'}`;
      } else {
        desc = `Là Con của ${otherPerson?.fullName || 'Cha/Mẹ'}`;
      }
      return {
        id: r.id,
        otherPerson,
        description: desc,
        type: r.type,
      };
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personAId || !personBId) {
      alert('Vui lòng chọn cả hai thành viên cần nối quan hệ!');
      return;
    }
    if (personAId === personBId) {
      alert('Không thể nối quan hệ một người với chính họ!');
      return;
    }
    if (existingRel) {
      alert('Hai thành viên này đã có mối quan hệ được thiết lập trên hệ thống!');
      return;
    }

    const updatedPersonsList: Person[] = [];

    if (relationType === 'MARRIAGE') {
      const newRel: Relationship = {
        id: `rel-${Date.now()}`,
        treeId: personA?.treeId || 'tree-nguyen-dai-toc-01',
        type: 'MARRIAGE',
        fromPersonId: personAId,
        toPersonId: personBId,
        marriageOrder,
      };

      // If one is lineage and one is not, or sync generation if requested
      if (personA && personB && autoSyncGeneration && personA.generation !== personB.generation) {
        // Sync spouse generation to match husband/lineage person
        const baseGen = personA.isLineage ? personA.generation : personB.generation;
        if (!personA.isLineage) updatedPersonsList.push({ ...personA, generation: baseGen });
        if (!personB.isLineage) updatedPersonsList.push({ ...personB, generation: baseGen });
      }

      onSaveRelationship(newRel, updatedPersonsList.length > 0 ? updatedPersonsList : undefined);
    } else {
      // PARENT_CHILD
      const parentId = parentDirection === 'A_IS_PARENT' ? personAId : personBId;
      const childId = parentDirection === 'A_IS_PARENT' ? personBId : personAId;
      const parentPerson = allPersons.find((p) => p.id === parentId);
      const childPerson = allPersons.find((p) => p.id === childId);

      const newRel: Relationship = {
        id: `rel-${Date.now()}`,
        treeId: parentPerson?.treeId || 'tree-nguyen-dai-toc-01',
        type: 'BIOLOGICAL_PARENT',
        fromPersonId: parentId,
        toPersonId: childId,
      };

      // Automatically update child's generation = parent.generation + 1
      if (parentPerson && childPerson && autoSyncGeneration) {
        if (childPerson.generation !== parentPerson.generation + 1) {
          updatedPersonsList.push({
            ...childPerson,
            generation: parentPerson.generation + 1,
            branchName: childPerson.branchName || parentPerson.branchName,
          });
        }
      }

      onSaveRelationship(newRel, updatedPersonsList.length > 0 ? updatedPersonsList : undefined);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#8B2E2E] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#E5C378]/40 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#E5C378]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif flex items-center gap-2">
                Nối Quan Hệ Giữa 2 Thành Viên
              </h2>
              <p className="text-xs text-white/80">
                Thiết lập hôn phối (vợ/chồng) hoặc huyết thống (cha mẹ - con cái) giữa các card hiện có
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Visual Link Preview Cards */}
          <div className="bg-white p-4 rounded-xl border border-[#D5C7A9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Person A Box */}
            <div className="flex-1 w-full p-3 rounded-lg bg-[#FAF4EB] border border-[#E5DAC0] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8B2E2E] block mb-1">
                Thành Viên 1
              </span>
              <p className="font-serif font-bold text-sm text-stone-800 truncate">
                {personA ? personA.fullName : 'Chưa chọn'}
              </p>
              <p className="text-[11px] text-stone-500">
                {personA ? `Đời ${personA.generation} • ${personA.gender === 'MALE' ? 'Nam' : 'Nữ'}` : ''}
              </p>
            </div>

            {/* Link Symbol */}
            <div className="flex flex-col items-center justify-center shrink-0">
              {relationType === 'MARRIAGE' ? (
                <div className="w-10 h-10 rounded-full bg-red-100 text-[#8B2E2E] flex items-center justify-center shadow-xs border border-red-200">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs border border-amber-200">
                  <GitBranch className="w-5 h-5" />
                </div>
              )}
              <span className="text-[10px] font-bold text-stone-600 mt-1">
                {relationType === 'MARRIAGE' ? 'Hôn phối' : 'Huyết thống'}
              </span>
            </div>

            {/* Person B Box */}
            <div className="flex-1 w-full p-3 rounded-lg bg-[#FAF4EB] border border-[#E5DAC0] text-center">
              <span className="text-[10px] font-bold uppercase text-[#8B2E2E] block mb-1">
                Thành Viên 2
              </span>
              <p className="font-serif font-bold text-sm text-stone-800 truncate">
                {personB ? personB.fullName : 'Chưa chọn'}
              </p>
              <p className="text-[11px] text-stone-500">
                {personB ? `Đời ${personB.generation} • ${personB.gender === 'MALE' ? 'Nam' : 'Nữ'}` : ''}
              </p>
            </div>
          </div>

          {/* Warning if already connected */}
          {existingRel && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                Hai thành viên này đã có mối quan hệ <strong>{existingRel.type === 'MARRIAGE' ? 'Hôn phối' : 'Cha mẹ - Con'}</strong> trong hệ thống.
              </span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4 bg-white p-5 rounded-xl border border-[#D5C7A9]">
            {/* 1. Chọn Người A & Người B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Chọn Thành Viên 1:
                </label>
                <select
                  value={personAId}
                  onChange={(e) => setPersonAId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium focus:outline-none focus:border-[#8B2E2E]"
                >
                  {allPersons.map((p) => (
                    <option key={p.id} value={p.id}>
                      Đời {p.generation}: {p.fullName} ({p.gender === 'MALE' ? 'Nam' : 'Nữ'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Chọn Thành Viên 2:
                </label>
                <select
                  value={personBId}
                  onChange={(e) => setPersonBId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium focus:outline-none focus:border-[#8B2E2E]"
                >
                  {allPersons
                    .filter((p) => p.id !== personAId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        Đời {p.generation}: {p.fullName} ({p.gender === 'MALE' ? 'Nam' : 'Nữ'})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* 2. Loại Quan Hệ */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">
                Xác Định Mối Quan Hệ Giữa Hai Người:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRelationType('MARRIAGE')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    relationType === 'MARRIAGE'
                      ? 'border-[#8B2E2E] bg-red-50/70 text-[#8B2E2E] ring-2 ring-red-200 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      relationType === 'MARRIAGE'
                        ? 'text-[#8B2E2E] fill-current'
                        : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold block">Quan Hệ Vợ Chồng</span>
                    <span className="text-[10px] text-stone-500">
                      Tự động gộp vào 1 card gia đình
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRelationType('PARENT_CHILD')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    relationType === 'PARENT_CHILD'
                      ? 'border-[#8B2E2E] bg-amber-50/70 text-amber-900 ring-2 ring-amber-200 shadow-2xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <GitBranch
                    className={`w-5 h-5 ${
                      relationType === 'PARENT_CHILD' ? 'text-amber-700' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold block">Cha / Mẹ ➔ Con Cái</span>
                    <span className="text-[10px] text-stone-500">
                      Vẽ đường nối huyết thống cội nguồn
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Chi tiết phụ thuộc loại quan hệ */}
            {relationType === 'MARRIAGE' ? (
              <div className="p-3 bg-[#FAF7EE] rounded-xl border border-[#D5C7A9] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">
                    Thứ bậc hôn phối:
                  </label>
                  <select
                    value={marriageOrder}
                    onChange={(e) => setMarriageOrder(Number(e.target.value))}
                    className="px-3 py-1 rounded-lg border border-stone-300 text-xs bg-white font-medium"
                  >
                    <option value={1}>Chính thất (Bà Cả / Vợ đầu)</option>
                    <option value={2}>Kế thất (Bà Hai / Vợ kế)</option>
                    <option value={3}>Bà Ba</option>
                  </select>
                </div>
                <p className="text-[11px] text-stone-500 italic">
                  💡 Sau khi nối, nếu bạn đang bật chế độ <strong>Gộp Vợ Chồng (1 Card)</strong> trên cây phả hệ, 2 card sẽ tự động nhập lại thành 1 card gia đình song thân.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-[#FAF7EE] rounded-xl border border-[#D5C7A9] space-y-2.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Chiều huyết thống (Ai là Cha/Mẹ, ai là Con?):
                </label>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-white border border-stone-200 hover:border-[#8B2E2E]">
                    <input
                      type="radio"
                      name="parentDirection"
                      checked={parentDirection === 'A_IS_PARENT'}
                      onChange={() => setParentDirection('A_IS_PARENT')}
                      className="text-[#8B2E2E]"
                    />
                    <span>
                      <strong>{personA?.fullName || 'Người 1'}</strong> là Cha / Mẹ của{' '}
                      <strong>{personB?.fullName || 'Người 2'}</strong>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-white border border-stone-200 hover:border-[#8B2E2E]">
                    <input
                      type="radio"
                      name="parentDirection"
                      checked={parentDirection === 'B_IS_PARENT'}
                      onChange={() => setParentDirection('B_IS_PARENT')}
                      className="text-[#8B2E2E]"
                    />
                    <span>
                      <strong>{personB?.fullName || 'Người 2'}</strong> là Cha / Mẹ của{' '}
                      <strong>{personA?.fullName || 'Người 1'}</strong>
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoSyncGen"
                    checked={autoSyncGeneration}
                    onChange={(e) => setAutoSyncGeneration(e.target.checked)}
                    className="rounded text-[#8B2E2E]"
                  />
                  <label htmlFor="autoSyncGen" className="text-xs text-stone-700 cursor-pointer">
                    Tự động đồng bộ số đời của con = đời của cha/mẹ + 1
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Existing relationships of Person A (Allows unlinking/deletion) */}
          {personARels.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
                Các mối quan hệ hiện tại của {personA?.fullName}:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {personARels.map((rel) => (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {rel.type === 'MARRIAGE' ? (
                        <Heart className="w-3.5 h-3.5 text-red-600 fill-current shrink-0" />
                      ) : (
                        <GitBranch className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      )}
                      <span className="truncate">
                        <strong>{rel.otherPerson?.fullName}</strong> — {rel.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteRelationship(rel.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 text-[11px] font-bold flex items-center gap-1 shrink-0 ml-2 cursor-pointer border border-red-200"
                      title="Gỡ bỏ mối quan hệ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Gỡ nối
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={Boolean(existingRel)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B2E2E] to-[#681E1E] disabled:opacity-50 text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác Nhận Nối Quan Hệ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
