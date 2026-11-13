---
name: vercel-react-best-practices
description: Tối ưu hóa cấu trúc React components, TypeScript, trạng thái, bundle size và hiệu năng dựng phả đồ quy mô lớn (React Flow + ELK.js).
---

# Vercel React Best Practices - High Performance Genealogy

## 1. Cấu Trúc Thành Phần & Clean Architecture
- **Tách biệt Logic & UI**:
  - Dùng custom hooks cho tương tác cây gia phả: `useGenealogyLayout`, `useGenealogySearch`, `useMemberFilter`.
  - Phân tách Dumb Components (NodeCard, MemberAvatar, RelationshipBadge) và Smart Components (GenealogyTreeCanvas, TimelineController).
- **TypeScript Chặt Chẽ (Strict Typing)**:
  - Khai báo model `FamilyMember`, `Relationship`, `Generation`, `BranchNode`, `MarriageNode`.
  - Tránh `any`; tận dụng discriminating unions cho các loại nút (PersonNode, FamilyUnionNode, MilestoneNode).

## 2. Tối Ưu Hiệu Năng Cây Phả Đồ (React Flow + ELK.js)
- **ELK.js Web Worker**:
  - ELK.js tính toán thuật toán layered graph layout rất tốn CPU khi số lượng nút lên đến hàng trăm/hàng nghìn thành viên.
  - Luôn chạy ELK layout trong **Web Worker** hoặc async task để giao diện không bao giờ bị đơ (UI unblocked at 60 FPS).
- **Virtualization & Viewport Culling**:
  - React Flow tự động hỗ trợ culling (chỉ render các node nằm trong viewport).
  - Tối ưu `React.memo` với custom comparison cho `MemberNodeComponent` để tránh re-render thừa thãi khi pan/zoom.
- **Dynamic Imports**:
  - Lazy load các thành phần nặng: Thư viện xuất PDF phả ký bản in khổ lớn, modal chỉnh sửa phức tạp, thư viện ELK worker.

## 3. Quản Lý Trạng Thái (State Management)
- Tận dụng Zustand hoặc React Context có chia selector nhỏ (`useTreeStore(s => s.activeMemberId)`), ngăn chặn render lan toả toàn bộ cây khi chỉ chọn một người.
- Lưu cache layout graph đã tính toán theo id họ tộc và phiên bản sửa đổi (IndexedDB/Local cache) để mở cây tức thì khi quay lại.
