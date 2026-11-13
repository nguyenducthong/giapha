---
name: frontend-design
description: Tạo giao diện có bản sắc riêng, hiện đại, mang đậm hồn cốt văn hóa gia tộc dòng họ Việt Nam, chống rập khuôn dashboard SaaS.
---

# Frontend Design - Bản Sắc Dòng Họ & Văn Hóa Việt Nam

## 1. Bản Sắc Riêng Biệt (Unique Identity)
- **Tuyệt đối không rập khuôn**: Tránh xa các giao diện bootstrap/admin dashboard màu xanh dương/xám tẻ nhạt, bảng table liệt kê thô cứng không cảm xúc.
- **Biểu tượng & Họa tiết Văn hóa Dòng họ**:
  - Họa tiết vân mây thời Lý - Trần - Lê (cách điệu tối giản dạng SVG vector).
  - Khung viền triện đồng, đường kỷ hà tinh tế, góc bo cong kết hợp điểm neo góc vuông truyền thống.
  - Hoa sen cách điệu, lá bồ đề, cuốn thư, ấn triện dòng họ (Seal badge).
- **Trải nghiệm Kể chuyện (Heritage Storytelling)**:
  - Trang chủ là một cuốn biên niên sử mở ra: từ câu đối cội nguồn ("Cây có cội mới trổ cành xanh lá / Nước có nguồn mới bủa khắp rạch sông"), lời tựa từ đường, đến con số ấn tượng của gia tộc (số đời, số đinh, địa bàn phân bổ, danh nhân dòng họ).

## 2. Thiết Kế Cây Gia Phả Đậm Chất Việt
- Mỗi "Node" (Nhân vật) trong cây gia phả không chỉ là một cái hộp chữ nhật thông thường:
  - Viền mạ vàng cho Bậc Tiên Tổ / Thủy Tổ / Trưởng họ.
  - Phù hiệu danh xưng: Đời thứ N (Thế hệ), Chi thứ, Ngành trưởng.
  - Huy hiệu trạng thái: Còn sống (đèn ngọc xanh/vàng ấm) hoặc Đã khuất (ký hiệu hoa sen trắng/cúc vàng, hiển thị ngày giỗ âm lịch).
  - Hiển thị mối quan hệ vợ chồng (Chính thất, Kế thất) bằng đường nối song hành ấm áp, không gây nhầm lẫn thế hệ con cái.
  - Kết nối con cái phân nhánh mạch lạc theo thứ tự xuất sinh (Trưởng nam, Thứ nam, Trưởng nữ...).

## 3. Chuyển Động & Tương Tác Cảm Xúc (Motion & Micro-interactions)
- Hiệu ứng mở Cuốn Phả Ký (Smooth unfold animation).
- Trôi lướt êm ái khi tìm kiếm và định vị nhân vật trong cây phả đồ (Smooth auto-pan & zoom zoom-to-fit với React Flow).
- Modal chi tiết nhân vật mở dạng tấm sớ hoặc thẻ bài di sản sang trọng với tiểu sử, mộ phần, công trạng, hình ảnh tư liệu.
