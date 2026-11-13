import React from 'react';
import { FamilyTreeInfo, Person, ClanArticle, ClanEvent } from '../../types/genealogy';
import { 
  Building2, MapPin, History, BookOpen, Users, Calendar, 
  ArrowRight, Sparkles, Phone, Mail, Award, Landmark,
  LogIn, UserPlus, Shield, Edit3
} from 'lucide-react';

interface ClanPublicPortalProps {
  treeInfo: FamilyTreeInfo;
  ancestor: Person;
  patriarch: Person;
  articles: ClanArticle[];
  events: ClanEvent[];
  onExploreTree: () => void;
  onOpenKinshipFinder: () => void;
  onOpenAuth?: () => void;
  onEditPortal?: () => void;
  currentUser?: string | null;
  myPersonName?: string | null;
}

export const ClanPublicPortal: React.FC<ClanPublicPortalProps> = ({
  treeInfo,
  ancestor,
  patriarch,
  articles,
  events,
  onExploreTree,
  onOpenKinshipFinder,
  onOpenAuth,
  onEditPortal,
  currentUser,
  myPersonName,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Temple/Ancestral Hall Vibe */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E2522] via-[#2D1B1B] to-[#1E2522] text-white p-8 sm:p-14 shadow-2xl border-2 border-heritage-gold/30">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-heritage-gold/20 text-heritage-goldLight text-xs font-semibold uppercase tracking-widest border border-heritage-gold/30">
            <Sparkles className="w-4 h-4" />
            Di Sản Dòng Tộc Việt Nam 4.0
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">
            {treeInfo.name}
          </h1>

          <p className="text-lg sm:text-xl font-serif italic text-heritage-goldLight max-w-2xl mx-auto opacity-95">
            "{treeInfo.coupletText}"
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 pt-2">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-heritage-gold" />
              {treeInfo.ancestralHall}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-heritage-gold" />
              {treeInfo.originPlace}
            </span>
            <span className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-heritage-gold" />
              Khởi dựng từ năm {treeInfo.foundedYear}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {!currentUser && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 bg-gradient-to-r from-heritage-gold to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-amber-500/40 hover:scale-105 transition-all flex items-center gap-2 border border-amber-300/40"
              >
                <LogIn className="w-4 h-4" />
                Đăng Nhập Thành Viên Dòng Họ
              </button>
            )}
            {currentUser && (
              <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-heritage-gold/50 text-xs flex items-center gap-2.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Thành viên: <strong>{currentUser}</strong> {myPersonName ? `(Tôi: ${myPersonName})` : ''}</span>
              </div>
            )}
            {onEditPortal && (
              <button
                onClick={onEditPortal}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-[#8B2E2E] hover:brightness-110 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-amber-600/40 hover:scale-105 transition-all flex items-center gap-2 border border-amber-300/50"
                title="Chỉnh sửa thông tin giới thiệu, câu đối và lược sử dòng họ"
              >
                <Edit3 className="w-4 h-4 text-heritage-goldLight" />
                Chỉnh Sửa Giới Thiệu Dòng Họ
              </button>
            )}
            <button
              onClick={onExploreTree}
              className="px-6 py-3.5 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonLight text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-heritage-crimson/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Khám Phá Cây Phả Hệ Trực Quan
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenKinshipFinder}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              Tra Cứu Xưng Hô Trong Họ
            </button>
          </div>
        </div>

        {/* Ambient subtle glow backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-heritage-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Statistics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="p-6 bg-white rounded-2xl border border-heritage-border text-center shadow-heritage-sm space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-serif text-heritage-crimson">
            {treeInfo.totalGenerations}
          </div>
          <div className="text-xs font-semibold text-heritage-inkMuted uppercase tracking-wider">
            Thế Hệ Tiếp Nối
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-heritage-border text-center shadow-heritage-sm space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-serif text-heritage-moss">
            {treeInfo.totalMembers}+
          </div>
          <div className="text-xs font-semibold text-heritage-inkMuted uppercase tracking-wider">
            Thành Viên Phả Hệ
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-heritage-border text-center shadow-heritage-sm space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-serif text-heritage-goldMuted">
            340+
          </div>
          <div className="text-xs font-semibold text-heritage-inkMuted uppercase tracking-wider">
            Năm Lịch Sử Lưu Truyền
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-heritage-border text-center shadow-heritage-sm space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-serif text-heritage-ink">
            {treeInfo.branchesCount}
          </div>
          <div className="text-xs font-semibold text-heritage-inkMuted uppercase tracking-wider">
            Chi Cành Lớn
          </div>
        </div>
      </section>

      {/* Cổng Thành Viên & Nhận Diện Phả Hệ Trực Tiếp */}
      {!currentUser && onOpenAuth && (
        <section className="max-w-5xl mx-auto bg-gradient-to-r from-[#FAF4EB] via-white to-[#FAF4EB] rounded-2xl border-2 border-heritage-gold/50 p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-heritage-crimson/10 text-heritage-crimson rounded-full text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-heritage-crimson" />
              Cổng Thành Viên Dòng Họ
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-heritage-ink">
              Bạn là con cháu của dòng họ {treeInfo.name}?
            </h3>
            <p className="text-xs sm:text-sm text-heritage-inkMuted max-w-xl leading-relaxed">
              Đăng nhập ngay để nhận diện vị trí của mình trên cây phả hệ, tự động xác định quan hệ xưng hô thân tộc và cùng đóng góp biên soạn gia phả.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onOpenAuth}
              className="px-5 py-3 bg-heritage-crimson hover:bg-heritage-crimsonDark text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-heritage-goldLight" />
              Đăng Nhập Ngay
            </button>
            <button
              onClick={onOpenAuth}
              className="px-5 py-3 bg-white hover:bg-heritage-parchment text-heritage-ink font-semibold rounded-xl text-xs border border-heritage-gold transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-heritage-crimson" />
              Tạo Tài Khoản Mới
            </button>
          </div>
        </section>
      )}

      {/* Lịch Sử Dòng Họ & Bậc Thủy Tổ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
        {/* Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-heritage-crimson">
              <History className="w-4 h-4" />
              Nguồn Cội & Lịch Sử Dòng Tộc
            </div>
            {onEditPortal && (
              <button
                onClick={onEditPortal}
                className="text-xs text-amber-800 hover:text-heritage-crimson font-semibold flex items-center gap-1 px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200/70 rounded-lg transition-colors border border-amber-300/60"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Chỉnh sửa lược sử
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-heritage-ink leading-snug">
            Khởi Phát Từ Miền Địa Linh Ba Vì Cổ Kính
          </h2>
          <p className="text-sm text-heritage-ink leading-relaxed">
            {treeInfo.historySummary}
          </p>
          <div className="p-4 bg-heritage-parchment rounded-xl border border-heritage-gold/30 text-xs text-heritage-ink space-y-2">
            <div className="font-bold text-heritage-crimson flex items-center gap-2">
              <Award className="w-4 h-4 text-heritage-gold" />
              Tộc Ước Dòng Họ:
            </div>
            <p className="italic">
              "Kính phụng tổ tiên, hiếu kính cha mẹ, hòa thuận anh em, siêng năng học hành lao động, giữ gìn danh tiết họ tộc."
            </p>
          </div>
        </div>

        {/* Ancestor & Patriarch Card Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Thủy Tổ Card */}
          <div className="p-5 bg-white rounded-2xl border-2 border-heritage-gold shadow-heritage-sm space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-heritage-gold mx-auto shadow-sm">
              <img src={ancestor.avatarUrl} alt={ancestor.fullName} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-heritage-crimson uppercase tracking-wide">
                Bậc Thủy Tổ Khai Sáng
              </span>
              <h3 className="text-base font-bold font-serif text-heritage-ink mt-0.5">
                {ancestor.fullName}
              </h3>
              <p className="text-xs text-heritage-goldMuted italic">
                {ancestor.courtesyName}
              </p>
              <p className="text-xs text-heritage-inkMuted mt-1">
                {ancestor.birthYear} – {ancestor.deathYear}
              </p>
            </div>
            <p className="text-[11px] text-heritage-inkMuted line-clamp-3 leading-relaxed border-t border-heritage-border pt-2">
              {ancestor.biography}
            </p>
          </div>

          {/* Patriarch Card */}
          <div className="p-5 bg-white rounded-2xl border border-heritage-border shadow-heritage-sm space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-heritage-moss mx-auto shadow-sm">
              <img src={patriarch.avatarUrl} alt={patriarch.fullName} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-bold text-heritage-moss uppercase tracking-wide">
                Trưởng Tộc Đương Nhiệm
              </span>
              <h3 className="text-base font-bold font-serif text-heritage-ink mt-0.5">
                {patriarch.fullName}
              </h3>
              <p className="text-xs text-heritage-inkMuted italic">
                Đời thứ {patriarch.generation}
              </p>
              <p className="text-xs text-heritage-inkMuted mt-1">
                Sinh năm {patriarch.birthYear}
              </p>
            </div>
            <p className="text-[11px] text-heritage-inkMuted line-clamp-3 leading-relaxed border-t border-heritage-border pt-2">
              {patriarch.biography}
            </p>
          </div>
        </div>
      </section>

      {/* Trích Lục Phả Ký & Tư Liệu Cổ */}
      <section className="bg-heritage-parchment/60 p-8 rounded-3xl border border-heritage-border max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-heritage-border pb-4">
          <div>
            <span className="text-xs font-bold text-heritage-crimson uppercase tracking-wider block">
              Tàng Kinh Các Số
            </span>
            <h2 className="text-2xl font-bold font-serif text-heritage-ink mt-0.5">
              Phả Ký Biên Niên & Văn Thơ Dòng Họ
            </h2>
          </div>
          <span className="text-xs text-heritage-inkMuted bg-white px-3 py-1.5 rounded-lg border border-heritage-border">
            Đã số hóa từ bản chữ Nho
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white p-5 rounded-2xl border border-heritage-border shadow-heritage-sm space-y-3 hover:border-heritage-gold transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-heritage-inkMuted">
                <span className="font-semibold text-heritage-crimson">{art.category}</span>
                <span>{art.publishDate}</span>
              </div>
              <h3 className="text-base font-bold font-serif text-heritage-ink hover:text-heritage-crimson transition-colors cursor-pointer">
                {art.title}
              </h3>
              <p className="text-xs text-heritage-inkMuted italic">
                Tác giả: {art.author}
              </p>
              <p className="text-xs text-heritage-ink leading-relaxed">
                {art.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Liên Hệ Ban Trị Sự Dòng Họ */}
      <section className="bg-white p-8 rounded-3xl border border-heritage-border max-w-4xl mx-auto text-center space-y-4 shadow-heritage-sm">
        <h3 className="text-xl font-bold font-serif text-heritage-ink">
          Ban Trị Sự Từ Đường Nguyễn Tộc
        </h3>
        <p className="text-xs text-heritage-inkMuted max-w-lg mx-auto">
          Mọi con cháu họ Nguyễn ở khắp mọi miền tổ quốc và kiều bào ở nước ngoài có nhu cầu chép gia phả, đính chính thông tin hoặc dâng lễ cúng bái xin liên hệ Ban Quản Trị Từ Đường.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-heritage-ink pt-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-heritage-moss" />
            Nhà Thờ Tổ: Thôn Cổ Đô, Ba Vì, Hà Nội
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-heritage-crimson" />
            Điện thoại: 0912.345.678 (Cụ Trưởng Tộc)
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-heritage-gold" />
            Email: bandieuhanh@nguyendaitoc.vn
          </span>
        </div>
      </section>
    </div>
  );
};
