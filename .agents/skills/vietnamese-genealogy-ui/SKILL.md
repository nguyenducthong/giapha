---
name: vietnamese-genealogy-ui
description: Quy chuẩn nghiệp vụ phả hệ Việt Nam, thuật ngữ dòng họ, cấu trúc cây phả đồ, thứ bậc gia đình và phong tục truyền thống.
---

# Vietnamese Genealogy UI - Quy Chuẩn Nghiệp Vụ & Phả Hệ Việt Nam

## 1. Thuật Ngữ Nghiệp Vụ Chuẩn Việt Nam
- **Thế Thứ & Phân Cấp Dòng Họ**:
  - **Thủy Tổ / Tiên Tổ**: Bậc khai sáng dòng họ (Đời 1 / Đời khai sinh).
  - **Trưởng Tộc / Tộc Trưởng**: Người đứng đầu gánh vác việc họ, giữ gia phả và hương hỏa.
  - **Trưởng Chi / Trưởng Ngành**: Người kế thừa của các chi, phái.
  - **Chi / Ngành / Nhánh / Phái**: Phân cấp cành nhánh của dòng tộc.
  - **Đời / Thế Hệ (Generation)**: Đời 1, Đời 2, ..., Đời N (Đại đồng đường).
- **Hôn Phối & Phối Ngẫu**:
  - **Chính Thất**: Bà cả / Người vợ đầu tiên.
  - **Kế Thất / Thứ Thất**: Người vợ kế, bà hai / bà ba (cần hiển thị rành mạch con cái thuộc bà nào, giữ được sự tôn trọng và chính xác lịch sử).
- **Thứ Tự Huynh Đệ Trong Nhà**:
  - Trưởng nam, Thứ nam, Tam nam...
  - Trưởng nữ, Thứ nữ...
  - Rể (Tế), Dâu (Phụ).
- **Trạng Thái Sinh - Tử & Phong Tục**:
  - **Hưởng thọ / Hưởng dương**: Tuổi thọ (trên 60 tuổi gọi là Hưởng thọ, dưới 60 gọi là Hưởng dương).
  - **Ngày Giỗ Âm Lịch & Can Chi**: Ngày kỵ nhật (ví dụ: ngày 15 tháng Tám năm Quý Mão). Hiển thị lịch can chi để con cháu tiện theo dõi và sửa soạn lễ bái.
  - **Mộ Phần & Định Vị Tâm Linh**: Nơi an nghỉ (Nghĩa trang dòng họ, tọa độ GPS, chỉ dẫn hương khói).

## 2. Quy Tắc Trực Quan Hóa Cây Phả Đồ (ELK.js + React Flow)
- **Cấu Trúc Tầng (Layered Hierarchy)**:
  - Thế hệ (Đời) chạy theo phương dọc từ trên xuống dưới (hoặc ngang từ trái qua phải tùy chọn), các thành viên cùng đời nằm trên cùng một đường trục thẳng hàng (Layer synchronization).
  - Trục huyết thống nối từ Cha/Mẹ -> Nút Hôn Phối (Family Union) -> Con cái.
  - Tách bạch nhánh Nội (dòng họ chính) và nhánh Ngoại/dâu rể khi cần rút gọn góc nhìn.
- **Tính Năng Bắt Buộc Cho Cây Phả Đồ**:
  - Lọc theo Đời (ví dụ: chỉ hiện từ Đời 1 đến Đời 5).
  - Lọc theo Chi/Nhánh (ví dụ: chỉ xem nhánh Chi 2, giấu các chi khác để giảm tải thị giác).
  - Tính năng "Tìm Đường Dẫn Huyết Thống" (Bloodline Path Finder): Tìm quan hệ xưng hô giữa hai người bất kỳ trong dòng họ (ví dụ: "Nguyễn Văn A" gọi "Nguyễn Văn B" là gì? - Tự động tính xưng hô chuẩn Việt: Chú họ, Bác họ, Cô, Dì, Anh em chú bác...).
  - Đánh dấu người kế tự / Trưởng chi bằng huy hiệu vinh danh.
