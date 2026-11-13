---
name: ui-ux-pro-max
description: Nghiên cứu phong cách, chọn bảng màu, typography, layout rhythm và design system tiêu chuẩn cao cho website Gia Phả Việt.
---

# UI/UX Pro Max - Design Standards for Gia Phả Việt

## 1. Triết lý Thiết kế (Design Philosophy)
- **Tôn nghiêm & Ấm cúng (Reverence & Warmth)**: Không tạo cảm giác lạnh lùng như phần mềm hành chính hay dashboard SaaS thông thường. Giao diện phải khơi gợi niềm tự hào dòng tộc, cảm giác kết nối nguồn cội gia đình.
- **Hiện đại nhưng Không Mất Chất (Modern Heritage)**: Ứng dụng kỹ thuật UI hiện đại (Glassmorphism, Subtle Gradients, Micro-animations 60fps, Bento-grid layouts) kết hợp với chất liệu văn hóa truyền thống (chất giấy dó số hóa, vân mây cách điệu, sắc đồng thau, viền chỉ vàng hoàng kim).
- **Thân thiện Đa Thế Hệ (Intergenerational Accessibility)**: Người cao tuổi (trưởng họ, các cụ) đọc rõ chữ, tương tác dễ dàng; thế hệ trẻ (gen Z, millennials) thấy hấp dẫn, trực quan, mượt mà trên smartphone.

## 2. Hệ Thống Màu Sắc (Color Tokens)
- **Primary / Heritage Crimson**: Sắc đỏ son mài, hồng ngọc trầm (`#8B1E1E`, `#A72626`, `#5C1010`) - Tượng trưng cho huyết thống, sự linh thiêng và trường tồn.
- **Secondary / Imperial Gold & Bronze**: Vàng ánh kim, đồng thau quý phái (`#D4AF37`, `#E5C158`, `#997D25`) - Tượng trưng cho gia phong hiển đạt, bảng vàng bia đá.
- **Accent / Ancient Jade & Celadon**: Ngọc bích, lam trầm (`#1E4D40`, `#2A6B59`) - Tượng trưng cho sự thanh tao, bình an, trường thọ.
- **Surface / Rice Paper & Aged Silk**: Màu nền be ngà, giấy điệp (`#FAF8F5`, `#F3EFEA`, `#181513` cho Dark/Temple Mode).
- **Neutral Dark / Ebony & Lacquer**: Gỗ mun, sơn mài đen tuyền bóng mờ (`#1A1715`, `#26221F`, `#3B3632`).

## 3. Typography Hierarchy
- **Heading / Serif Văn Hiến**: `Playfair Display` hoặc `Cinzel` hoặc `Cormorant Garamond` kết hợp font tiếng Việt hoàn hảo `Be Vietnam Pro`.
- **Body & Controls / Sans-serif Hiện Đại**: `Be Vietnam Pro` hoặc `Plus Jakarta Sans` với độ nét cao, hỗ trợ dấu tiếng Việt chuẩn xác ở mọi kích thước màn hình.
- **Scale**:
  - H1 Display: 40px - 56px (Font-bold / Semi-bold, Letter-spacing nhẹ)
  - H2 Section: 28px - 36px
  - H3 Card Title: 20px - 24px
  - Body Regular: 15px - 16px (Line-height 1.6)
  - Caption / Metadata (Can chi, Đời thứ): 12px - 14px (Font-medium)

## 4. Layout & Spacing
- Hệ thống lưới 8-pt grid system: 4, 8, 16, 24, 32, 48, 64, 96px.
- Container: Max-width 1280px / 1440px trên màn hình lớn, padding an toàn 16px - 24px trên mobile.
- Elevation & Shadow: Tầng bóng mờ tự nhiên (multi-layered diffuse shadow) mang lại chiều sâu không gian (z-index rõ ràng giữa phả đồ, modal nhân vật và thanh điều hướng).
