---
name: web-design-guidelines
description: Kiểm tra và đảm bảo tính nhất quán, responsive đa thiết bị, chạm cảm ứng di động và khả năng tiếp cận (Accessibility - a11y) cho người cao tuổi.
---

# Web Design Guidelines - Usability & Accessibility

## 1. Thiết Kế Đáp Ứng Đa Thiết Bị (Mobile & Desktop)
- **Desktop (>= 1024px)**:
  - Tận dụng không gian rộng để hiển thị bảng điều khiển cây phả đồ đa chiều: thanh công cụ bên phải/trái (Zoom, Fit View, Lọc Đời, Tìm Kiếm, Đổi Chế Độ Phân Tầng Huyết Thống / Vợ Chồng).
  - Khung xem cây phả đồ toàn cảnh kèm MiniMap góc dưới.
- **Mobile (< 768px)**:
  - Thanh công cụ rút gọn thành Bottom Sheet hoặc Floating Action Menu dễ bấm bằng ngón tay cái (Thumb zone).
  - Tối ưu cử chỉ chạm 2 ngón (Pinch-to-zoom) và vuốt mượt mà (Pan).
  - Hỗ trợ chế độ "Xem Theo Danh Sách Chi Phái" (Vertical Hierarchy List) khi màn hình điện thoại quá nhỏ để xem cây phả đồ 10 thế hệ.

## 2. Khả Năng Tiếp Cận Cho Người Cao Tuổi (Elderly Accessibility - WCAG AA/AAA)
- **Độ Tương Phản (Color Contrast)**:
  - Chữ trên nền tối hoặc nền be giấy dó phải đạt tối thiểu tỷ lệ tương phản 4.5:1 (Normal text) và 3:1 (Large text).
  - Không dựa duy nhất vào màu sắc để phân biệt thông tin (ví dụ: người còn sống / đã mất phải có cả biểu tượng hoa sen/đèn lồng và nhãn chữ đi kèm).
- **Kích Thước Vùng Chạm (Touch Targets)**:
  - Mọi nút bấm, thẻ nhân vật trên mobile phải đạt tối thiểu 44x44px.
  - Nút chuyển đời / đổi chế độ hiển thị to rõ, không sát nhau gây bấm nhầm.
- **Công Cụ Hỗ Trợ Đọc Dòng Họ**:
  - Tùy chọn chuyển đổi kích thước chữ (Chữ thường / Chữ lớn cho người cao tuổi).
  - Hỗ trợ chuyển đổi Âm lịch / Dương lịch trực tiếp tại thông tin ngày sinh ngày mất.
