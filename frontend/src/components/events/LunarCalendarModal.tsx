import React, { useState } from 'react';
import { ClanEvent } from '../../services/api';
import { X, Calendar, MapPin, Bell, Flame, Sparkles, Heart } from 'lucide-react';

interface LunarCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: ClanEvent[];
  clanName: string;
}

export const LunarCalendarModal: React.FC<LunarCalendarModalProps> = ({
  isOpen,
  onClose,
  events,
  clanName,
}) => {
  const [incenseCount, setIncenseCount] = useState<number>(108);
  const [hasOffered, setHasOffered] = useState<boolean>(false);
  const [incenseMessage, setIncenseMessage] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleOfferIncense = () => {
    setIncenseCount((prev) => prev + 1);
    setHasOffered(true);
    setTimeout(() => setHasOffered(false), 4000);
  };

  const filteredEvents =
    filterMonth === 'ALL'
      ? events
      : events.filter((e) => e.dateLunar.includes(`/${filterMonth} `) || e.dateLunar.includes(`/${filterMonth} Âm`));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#E5C378]" />
            <div>
              <h2 className="text-xl font-bold font-serif">Lịch Giỗ Chạp & Tế Tự Dòng Tộc</h2>
              <p className="text-xs text-white/80">Tra cứu ngày giỗ âm lịch, lễ hội xuân thu nhị kỳ {clanName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incense Offering Shrine Banner (Dâng Hương Tưởng Niệm) */}
        <div className="bg-gradient-to-r from-[#2A231C] via-[#3D3025] to-[#2A231C] text-[#FAF7EE] p-5 border-b border-[#C49A45]/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#8B2E2E]/40 border-2 border-[#C49A45] flex items-center justify-center shadow-inner relative">
              <Flame className={`w-8 h-8 text-[#E5C378] ${hasOffered ? 'animate-bounce text-amber-300' : 'animate-pulse'}`} />
              {hasOffered && (
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-amber-500 text-[10px] text-white font-bold rounded-full animate-ping">
                  +1
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#E5C378]">
                  Điện Thờ Tổ Tiên – Dâng Nén Tâm Hương
                </h3>
                <span className="text-xs px-2 py-0.5 bg-[#C49A45]/20 text-[#E5C378] rounded-full border border-[#C49A45]/40">
                  {incenseCount} nén hương đã dâng
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-lg leading-relaxed">
                Con cháu muôn phương dù cách trở địa lý, hướng về nguồn cội với tất cả lòng thành kính và tri ân sâu sắc.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleOfferIncense}
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-[#C49A45] to-[#A07A30] hover:from-[#D4AA55] hover:to-[#B08A40] text-stone-900 font-bold text-xs rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-rose-950" />
              Thắp Nén Tâm Hương
            </button>
          </div>
        </div>

        {hasOffered && (
          <div className="bg-amber-100 text-amber-900 px-6 py-2 text-xs flex items-center justify-between border-b border-amber-300 animate-fade-in font-medium">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Tâm hương quyện khói mây xanh, nguyện cầu tiên tổ phù hộ độ trì cho dòng họ vạn đại phồn vinh!
            </span>
            <span className="text-[11px] text-amber-700">Nam Mô A Di Đà Phật</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#F3ECE0] border-b border-[#D5C7A9]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-700">Lọc theo tháng âm:</span>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="text-xs bg-white border border-[#D5C7A9] rounded-lg px-2.5 py-1.5 focus:outline-[#8B2E2E]"
            >
              <option value="ALL">Tất cả các tháng</option>
              <option value="01">Tháng Giêng (Xuân Tảo Mộ)</option>
              <option value="03">Tháng Ba (Thanh Minh)</option>
              <option value="08">Tháng Tám (Đại Lễ Giỗ Tổ)</option>
              <option value="10">Tháng Mười (Tết Trùng Cửu)</option>
              <option value="12">Tháng Chạp (Tạ Mộ Cuối Năm)</option>
            </select>
          </div>

          <span className="text-xs text-stone-500">
            Có {filteredEvents.length} kỳ tế tự trọng thể
          </span>
        </div>

        {/* Event List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-[#E5DAC0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#FAF7EE] border border-[#C49A45]/50 flex flex-col items-center justify-center text-center p-1 shadow-inner shrink-0">
                  <span className="text-[10px] font-bold text-[#8B2E2E] uppercase">Âm Lịch</span>
                  <span className="text-base font-serif font-extrabold text-stone-900 leading-tight">
                    {event.dateLunar.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-stone-500">Hàng năm</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-stone-800 text-base">
                      {event.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#8B2E2E]/10 text-[#8B2E2E]">
                      {event.eventType === 'DEATH_ANNIVERSARY' ? 'Giỗ Tổ / Tiên Thường' : 'Họp Mặt Dòng Tộc'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-[#8B2E2E]" />
                      {event.location || 'Tại nhà thờ họ'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-amber-600" />
                      Thông báo trước 7 ngày qua tin nhắn
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => alert(`Đã kích hoạt nhắc nhở cho sự kiện "${event.title}". Hệ thống sẽ gửi thông báo trước 3 ngày!`)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-[#FAF7EE] hover:bg-[#F3ECE0] border border-[#D5C7A9] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-[#8B2E2E]" />
                  Đặt Nhắc Nhở
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
