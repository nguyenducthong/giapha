import React from 'react';
import { FamilyTreeInfo, Person, ClanEvent } from '../../types/genealogy';
import { 
  Users, UserCheck, Flame, GitFork, Calendar, Award, 
  Clock, ArrowUpRight, Heart, BellRing, Sparkles, ChevronRight
} from 'lucide-react';

interface ClanDashboardProps {
  treeInfo: FamilyTreeInfo;
  persons: Person[];
  events: ClanEvent[];
  onNavigateToTree: () => void;
  onSelectPerson: (person: Person) => void;
  onOpenKinshipFinder: (person: Person) => void;
}

export const ClanDashboard: React.FC<ClanDashboardProps> = ({
  treeInfo,
  persons,
  events,
  onNavigateToTree,
  onSelectPerson,
  onOpenKinshipFinder,
}) => {
  // Sắp xếp các ngày giỗ sắp tới
  const deceasedMembers = persons.filter(p => p.status === 'DECEASED' && p.lunarDeathDate);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark text-white p-6 shadow-heritage-md">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-gold/25 text-heritage-goldLight text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Hội Đồng Quản Trị Gia Tộc Số 4.0
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            {treeInfo.name}
          </h2>
          <p className="text-sm opacity-90 italic font-serif">
            "{treeInfo.coupletText}"
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium opacity-85">
            <span>Quê quán: <strong>{treeInfo.originPlace}</strong></span>
            <span>Trưởng tộc: <strong>{treeInfo.patriarchName}</strong></span>
            <span>Khởi dựng: <strong>Năm {treeInfo.foundedYear}</strong></span>
          </div>
        </div>

        {/* Decorative circle ornament */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-heritage-gold/15 blur-2xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Members */}
        <div className="p-4 bg-white rounded-xl border border-heritage-border shadow-heritage-sm space-y-1">
          <div className="flex items-center justify-between text-heritage-inkMuted text-xs font-semibold">
            <span>Tổng Đinh & Dâu</span>
            <Users className="w-4 h-4 text-heritage-crimson" />
          </div>
          <div className="text-2xl font-bold font-serif text-heritage-ink">
            {treeInfo.totalMembers}
          </div>
          <div className="text-[11px] text-heritage-inkMuted">
            {treeInfo.maleCount} Nam • {treeInfo.femaleCount} Nữ
          </div>
        </div>

        {/* Living Count */}
        <div className="p-4 bg-white rounded-xl border border-heritage-border shadow-heritage-sm space-y-1">
          <div className="flex items-center justify-between text-heritage-inkMuted text-xs font-semibold">
            <span>Còn Sống</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700">
            {treeInfo.livingCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Đang sinh hoạt họ tộc
          </div>
        </div>

        {/* Deceased Count */}
        <div className="p-4 bg-white rounded-xl border border-heritage-border shadow-heritage-sm space-y-1">
          <div className="flex items-center justify-between text-heritage-inkMuted text-xs font-semibold">
            <span>Đã Quy Tiên</span>
            <Flame className="w-4 h-4 text-heritage-gold" />
          </div>
          <div className="text-2xl font-bold font-serif text-heritage-goldMuted">
            {treeInfo.deceasedCount}
          </div>
          <div className="text-[11px] text-heritage-inkMuted">
            Hương khói phụng thờ
          </div>
        </div>

        {/* Generations */}
        <div className="p-4 bg-white rounded-xl border border-heritage-border shadow-heritage-sm space-y-1">
          <div className="flex items-center justify-between text-heritage-inkMuted text-xs font-semibold">
            <span>Số Thế Hệ</span>
            <GitFork className="w-4 h-4 text-heritage-moss" />
          </div>
          <div className="text-2xl font-bold font-serif text-heritage-moss">
            {treeInfo.totalGenerations} Đời
          </div>
          <div className="text-[11px] text-heritage-inkMuted">
            Từ năm {treeInfo.foundedYear}
          </div>
        </div>

        {/* Branches */}
        <div className="p-4 bg-white rounded-xl border border-heritage-border shadow-heritage-sm space-y-1">
          <div className="flex items-center justify-between text-heritage-inkMuted text-xs font-semibold">
            <span>Chi Phái</span>
            <Users className="w-4 h-4 text-heritage-goldMuted" />
          </div>
          <div className="text-2xl font-bold font-serif text-heritage-ink">
            {treeInfo.branchesCount} Chi
          </div>
          <div className="text-[11px] text-heritage-inkMuted">
            Chi Trưởng & Chi Hai
          </div>
        </div>

        {/* Quick Launch Tree */}
        <div 
          onClick={onNavigateToTree}
          className="p-4 bg-gradient-to-br from-heritage-moss to-heritage-mossLight text-white rounded-xl shadow-heritage-sm space-y-1 cursor-pointer hover:shadow-heritage-md transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Cây Phả Hệ</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="text-xl font-bold font-serif pt-1">
            Mở Bản Đồ
          </div>
          <div className="text-[11px] opacity-85">
            React Flow + ELK ➔
          </div>
        </div>
      </div>

      {/* Main Dashboard Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lịch Giỗ Âm Lịch & Sự Kiện Dòng Họ (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lịch Kỵ Nhật / Ngày Giỗ Sắp Tới */}
          <div className="bg-white rounded-2xl border border-heritage-border p-5 shadow-heritage-sm space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-border pb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-heritage-crimson" />
                <h3 className="font-serif font-bold text-lg text-heritage-ink">
                  Kỵ Nhật Dòng Họ (Nhắc Giỗ Âm Lịch)
                </h3>
              </div>
              <span className="text-xs text-heritage-crimson font-semibold bg-heritage-parchment px-2.5 py-1 rounded-full border border-heritage-gold/30">
                Lịch Can Chi Chuẩn Xác
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deceasedMembers.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  onClick={() => onSelectPerson(member)}
                  className="p-3.5 rounded-xl border border-heritage-border bg-heritage-parchment/40 hover:bg-heritage-parchment hover:border-heritage-gold cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-heritage-gold flex items-center justify-center font-serif font-bold text-heritage-crimson text-sm shrink-0 shadow-2xs">
                    {member.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-heritage-ink group-hover:text-heritage-crimson truncate">
                        {member.fullName}
                      </h4>
                      <span className="text-[10px] text-heritage-inkMuted">
                        Đời {member.generation}
                      </span>
                    </div>
                    <p className="text-[11px] text-heritage-crimson font-bold mt-1">
                      Ngày Giỗ: {member.lunarDeathDate}
                    </p>
                    <p className="text-[10px] text-heritage-inkMuted truncate mt-0.5">
                      {member.tombLocation || member.branchName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sự Kiện & Hội Nghị Họ Tộc */}
          <div className="bg-white rounded-2xl border border-heritage-border p-5 shadow-heritage-sm space-y-4">
            <div className="flex items-center justify-between border-b border-heritage-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-heritage-moss" />
                <h3 className="font-serif font-bold text-lg text-heritage-ink">
                  Sự Kiện & Đại Lễ Dòng Tộc Sắp Diễn Ra
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-heritage-border bg-white hover:border-heritage-moss transition-colors space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-heritage-ink flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-heritage-moss"></span>
                      {ev.title}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EBF1ED] text-heritage-moss">
                      {ev.dateLunar}
                    </span>
                  </div>
                  <p className="text-xs text-heritage-inkMuted leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="text-[11px] text-heritage-inkMuted flex items-center gap-1.5 pt-1">
                    <span className="font-medium text-heritage-ink">Địa điểm:</span> {ev.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Thành Viên Nổi Bật & Cập Nhật Gần Đây */}
        <div className="space-y-6">
          {/* Cụ Thủy Tổ & Trưởng Tộc đương nhiệm */}
          <div className="bg-white rounded-2xl border border-heritage-border p-5 shadow-heritage-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-heritage-ink border-b border-heritage-border pb-2.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-heritage-gold" />
              Bậc Khai Sáng & Trưởng Tộc
            </h3>

            {/* Thủy Tổ */}
            {persons[0] && (
              <div 
                onClick={() => onSelectPerson(persons[0])}
                className="p-3 rounded-xl border border-heritage-gold/50 bg-gradient-to-r from-heritage-parchment to-white cursor-pointer hover:shadow-heritage-sm transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-heritage-gold shrink-0">
                  <img src={persons[0].avatarUrl} alt={persons[0].fullName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-heritage-crimson uppercase">Bậc Thủy Tổ (Đời 1)</div>
                  <div className="text-xs font-bold text-heritage-ink">{persons[0].fullName}</div>
                  <div className="text-[10px] text-heritage-inkMuted">{persons[0].courtesyName}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-heritage-gold" />
              </div>
            )}

            {/* Trưởng Tộc Đương Nhiệm */}
            {persons[10] && (
              <div 
                onClick={() => onSelectPerson(persons[10])}
                className="p-3 rounded-xl border border-heritage-border bg-[#F7F8FA] cursor-pointer hover:border-heritage-moss transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-heritage-moss shrink-0">
                  <img src={persons[10].avatarUrl} alt={persons[10].fullName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-heritage-moss uppercase">Trưởng Tộc Đương Nhiệm (Đời 4)</div>
                  <div className="text-xs font-bold text-heritage-ink">{persons[10].fullName}</div>
                  <div className="text-[10px] text-heritage-inkMuted">{persons[10].currentResidence}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-heritage-moss" />
              </div>
            )}
          </div>

          {/* Quick Kinship Tool Card */}
          <div className="bg-gradient-to-br from-heritage-parchment to-amber-50 rounded-2xl border-2 border-heritage-gold/40 p-5 shadow-heritage-sm space-y-3">
            <h3 className="font-serif font-bold text-base text-heritage-crimson flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tra Cứu Xưng Hô Tiếng Việt
            </h3>
            <p className="text-xs text-heritage-ink leading-relaxed">
              Dòng họ đông đúc nhiều chi nhánh, con cháu xa gần gặp nhau ngày chạp giỗ thường bối rối về cách xưng hô. Sử dụng công cụ tra cứu tự động theo vế thứ gia tộc.
            </p>
            <button
              onClick={() => onOpenKinshipFinder(persons[persons.length - 1] || persons[0])}
              className="w-full py-2.5 px-4 bg-heritage-crimson hover:bg-heritage-crimsonDark text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Mở Bảng Tra Cứu Xưng Hô
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
