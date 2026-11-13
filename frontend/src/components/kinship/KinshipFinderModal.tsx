import React, { useState } from 'react';
import { Person, Relationship } from '../../types/genealogy';
import { calculateKinship, KinshipResult } from '../../utils/kinshipCalculator';
import { X, ArrowRightLeft, Compass, Users, GitCommit, CheckCircle2 } from 'lucide-react';

interface KinshipFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPersonA?: Person | null;
  allPersons: Person[];
  allRelationships: Relationship[];
}

export const KinshipFinderModal: React.FC<KinshipFinderModalProps> = ({
  isOpen,
  onClose,
  initialPersonA,
  allPersons,
  allRelationships,
}) => {
  if (!isOpen) return null;

  const [personAId, setPersonAId] = useState<string>(
    initialPersonA?.id || allPersons[allPersons.length - 1]?.id || allPersons[0]?.id || ''
  );
  const [personBId, setPersonBId] = useState<string>(
    allPersons[0]?.id || ''
  );

  const kinshipResult: KinshipResult | null = 
    personAId && personBId 
      ? calculateKinship(personAId, personBId, allPersons, allRelationships)
      : null;

  const swapPersons = () => {
    const temp = personAId;
    setPersonAId(personBId);
    setPersonBId(temp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-heritage-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-heritage-moss to-heritage-mossDark text-white flex items-center justify-between shadow">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-heritage-goldLight" />
            <h3 className="text-lg font-bold font-serif">
              Tra Cứu Quan Hệ & Cách Xưng Hô Dòng Họ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Person A */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-heritage-ink mb-1.5">
                Người Xưng (A):
              </label>
              <select
                value={personAId}
                onChange={(e) => setPersonAId(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-lg border border-heritage-border bg-heritage-parchment/30 text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-moss"
              >
                {allPersons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} (Đời {p.generation} – {p.branchName})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:col-span-1 pt-4 md:pt-0">
              <button
                type="button"
                onClick={swapPersons}
                className="p-2.5 rounded-full bg-heritage-parchment border border-heritage-gold/40 text-heritage-crimson hover:bg-heritage-gold hover:text-white transition-all shadow-sm"
                title="Đổi chiều xưng hô"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Person B */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-heritage-ink mb-1.5">
                Người Được Gọi (B):
              </label>
              <select
                value={personBId}
                onChange={(e) => setPersonBId(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-lg border border-heritage-border bg-heritage-parchment/30 text-heritage-ink focus:outline-none focus:ring-2 focus:ring-heritage-moss"
              >
                {allPersons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} (Đời {p.generation} – {p.branchName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kinship Results Card */}
          {kinshipResult && (
            <div className="space-y-4">
              {/* Highlight Announcement */}
              <div className="bg-gradient-to-br from-heritage-parchment to-amber-50 p-5 rounded-xl border-2 border-heritage-gold/60 shadow-heritage-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* A -> B */}
                  <div className="p-3.5 bg-white rounded-lg border border-heritage-gold/40 shadow-sm">
                    <span className="text-[11px] font-bold text-heritage-inkMuted block uppercase">
                      {kinshipResult.personA.fullName} gọi {kinshipResult.personB.fullName} là:
                    </span>
                    <p className="mt-1 text-xl font-bold font-serif text-heritage-crimson">
                      {kinshipResult.addressTermAtoB}
                    </p>
                  </div>

                  {/* B -> A */}
                  <div className="p-3.5 bg-white rounded-lg border border-heritage-gold/40 shadow-sm">
                    <span className="text-[11px] font-bold text-heritage-inkMuted block uppercase">
                      {kinshipResult.personB.fullName} gọi {kinshipResult.personA.fullName} là:
                    </span>
                    <p className="mt-1 text-xl font-bold font-serif text-heritage-moss">
                      {kinshipResult.addressTermBtoA}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-xs text-heritage-ink bg-white/70 p-3 rounded-lg border border-heritage-border space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-heritage-moss">
                    <CheckCircle2 className="w-4 h-4" />
                    Cơ sở phân tích thế thứ:
                  </div>
                  <p className="leading-relaxed text-heritage-ink">
                    {kinshipResult.pathDescription}
                  </p>
                  {kinshipResult.generationDifference !== 0 && (
                    <p className="text-[11px] text-heritage-inkMuted pt-1">
                      Chênh lệch thế hệ: <strong>{Math.abs(kinshipResult.generationDifference)} đời</strong> ({kinshipResult.personA.fullName} Đời {kinshipResult.personA.generation} vs {kinshipResult.personB.fullName} Đời {kinshipResult.personB.generation}).
                    </p>
                  )}
                </div>
              </div>

              {/* Bloodline Path Visualizer */}
              <div className="p-4 bg-[#F7F8FA] rounded-xl border border-heritage-border">
                <h4 className="text-xs font-bold text-heritage-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4 text-heritage-crimson" />
                  Sơ Đồ Đường Dẫn Huyết Thống
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {kinshipResult.pathPersons.map((p, idx) => (
                    <React.Fragment key={p.id}>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-heritage-border shadow-2xs">
                        <div className="w-7 h-7 rounded-full bg-heritage-parchment flex items-center justify-center font-bold text-xs text-heritage-crimson">
                          {p.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-heritage-ink">{p.fullName}</div>
                          <div className="text-[10px] text-heritage-inkMuted">Đời thứ {p.generation}</div>
                        </div>
                      </div>
                      {idx < kinshipResult.pathPersons.length - 1 && (
                        <div className="text-heritage-gold font-bold">➔</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-heritage-parchment border-t border-heritage-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-heritage-moss hover:bg-heritage-mossLight text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
