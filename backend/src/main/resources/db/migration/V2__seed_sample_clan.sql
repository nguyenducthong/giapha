-- =============================================================================
-- MIGRATION V2: SEED DATA DÒNG HỌ NGUYỄN ĐẠI TỘC
-- Cung cấp bộ dữ liệu mẫu thực tế chuẩn xác cho kiểm thử Backend API và Frontend
-- =============================================================================

-- 1. Seed User Super Admin & Clan Leader
INSERT INTO users (id, email, phone_number, password_hash, full_name, is_super_admin)
VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@giaphaviet.vn', '0912345678', '$2a$10$wO0Oeqo7J1/2v3bH6p8V1.9lE8Z4m2G5B0Q9h8w7e6r5t4y3u2i1o', 'Quản Trị Viên Hệ Thống', TRUE),
('22222222-2222-2222-2222-222222222222', 'truongtoc@nguyendaitoc.vn', '0987654321', '$2a$10$wO0Oeqo7J1/2v3bH6p8V1.9lE8Z4m2G5B0Q9h8w7e6r5t4y3u2i1o', 'Nguyễn Trọng Tuyên', FALSE);

-- 2. Seed Family Tree (Dòng Họ Nguyễn Đại Tộc)
INSERT INTO family_trees (id, slug, name, ancestral_hall, origin_place, founded_year, couplet_text, history_summary, patriarch_name, is_public, created_by)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'nguyen-dai-toc-co-do',
    'Gia Phả Họ Nguyễn Đại Tộc',
    'Từ Đường Nguyễn Tộc – Thôn Cổ Đô',
    'Xã Cổ Đô, Huyện Ba Vì, TP. Hà Nội',
    1682,
    'Mộc xuất thiên chi do hữu bản – Thủy lưu vạn phái tổng đồng nguyên (Cây trổ ngàn cành do có cội – Nước chảy muôn nhánh bởi chung nguồn)',
    'Dòng họ Nguyễn Đại Tộc khởi phát từ cuối thế kỷ XVII tại đất địa linh nhân kiệt Ba Vì. Trải qua hơn ba trăm năm với nhiều thăng trầm lịch sử, dòng họ luôn giữ vững gia phong lễ giáo, hiếu học thành tài.',
    'Ông Nguyễn Trọng Tuyên (Đời 4 – Trưởng Tộc)',
    TRUE,
    '11111111-1111-1111-1111-111111111111'
);

-- 3. Seed Memberships
INSERT INTO family_tree_memberships (tree_id, user_id, role, is_verified)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'CLAN_LEADER', TRUE);

-- 4. Seed Branches
INSERT INTO family_branches (id, tree_id, branch_name, branch_order, origin_story)
VALUES 
('bbbbbbbb-0001-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Chi Trưởng (Ngành 1)', 1, 'Nhánh trưởng kế tục giữ hương hỏa từ đường tại Ba Vì'),
('bbbbbbbb-0002-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Chi Hai (Ngành 2)', 2, 'Nhánh thứ phát tích lập nghiệp, mở rộng các vườn dược liệu');

-- 5. Seed Core Persons (Đời 1 -> Đời 4)
INSERT INTO persons (id, tree_id, branch_id, primary_name, gender, generation, status, is_lineage, order_in_family, birth_year, death_year, lunar_death_date, lunar_death_can_chi, birth_place, tomb_location, avatar_url)
VALUES
-- Đời 1
('cccccccc-0001-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Nguyễn Quý Công', 'MALE', 1, 'DECEASED', TRUE, 'Thủy Tổ', 1682, 1754, '15/08 Âm lịch', 'Giáp Tuất', 'Cổ Đô, Ba Vì', 'Khu Lăng Cụ Thủy Tổ - Gò Phượng Hoàng', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
('cccccccc-0001-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'Lê Thị Diệu Thuần', 'FEMALE', 1, 'DECEASED', FALSE, 'Chính Thất', 1686, 1760, '06/03 Âm lịch', 'Canh Thìn', 'Đường Lâm, Sơn Tây', 'Gò Phượng Hoàng', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'),

-- Đời 2
('cccccccc-0002-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Nguyễn Trọng Phúc', 'MALE', 2, 'DECEASED', TRUE, 'Trưởng Nam', 1715, 1782, '12/10 Âm lịch', 'Nhâm Dần', 'Cổ Đô, Ba Vì', 'Gò Cây Gạo, Ba Vì', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
('cccccccc-0002-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Trần Thị Mai', 'FEMALE', 2, 'DECEASED', FALSE, 'Chính Thất', 1720, 1790, '19/02 Âm lịch', NULL, 'Cổ Đô', 'Khu lăng họ Trần', NULL),
('cccccccc-0002-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0002-0000-0000-000000000002', 'Nguyễn Trọng Thọ', 'MALE', 2, 'DECEASED', TRUE, 'Thứ Nam', 1722, 1795, '23/07 Âm lịch', NULL, 'Cổ Đô, Ba Vì', 'Bãi Cây Đa, Cổ Đô', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'),
('cccccccc-0002-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0002-0000-0000-000000000002', 'Hoàng Thị Cúc', 'FEMALE', 2, 'DECEASED', FALSE, 'Chính Thất', 1726, 1801, '14/11 Âm lịch', NULL, 'Ba Vì', NULL, NULL),

-- Đời 3
('cccccccc-0003-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Nguyễn Văn Hòa', 'MALE', 3, 'DECEASED', TRUE, 'Trưởng Nam Chi 1', 1750, 1823, '12/03 Âm lịch', 'Quý Mùi', 'Cổ Đô', 'Lăng Chi Trưởng', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'),
('cccccccc-0003-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Lý Thị Sen', 'FEMALE', 3, 'DECEASED', FALSE, 'Chính Thất', 1755, 1830, '18/06 Âm lịch', NULL, 'Ba Vì', NULL, NULL),

-- Đời 4 (Đương nhiệm)
('cccccccc-0004-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Nguyễn Trọng Tuyên', 'MALE', 4, 'LIVING', TRUE, 'Trưởng Tộc Đương Nhiệm', 1942, NULL, NULL, NULL, 'Cổ Đô, Ba Vì', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'),
('cccccccc-0004-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-0001-0000-0000-000000000001', 'Phạm Thị Mai', 'FEMALE', 4, 'LIVING', FALSE, 'Chính Thất', 1946, NULL, NULL, NULL, 'Thạch Thất', NULL, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=200&q=80');

-- 6. Seed Unions
INSERT INTO unions (id, tree_id, marriage_order)
VALUES
('dddddddd-0001-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
('dddddddd-0002-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
('dddddddd-0002-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
('dddddddd-0003-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1),
('dddddddd-0004-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1);

INSERT INTO union_partners (union_id, person_id)
VALUES
('dddddddd-0001-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000001'),
('dddddddd-0001-0000-0000-000000000001', 'cccccccc-0001-0000-0000-000000000002'),
('dddddddd-0002-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001'),
('dddddddd-0002-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000002'),
('dddddddd-0002-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000003'),
('dddddddd-0002-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000004'),
('dddddddd-0003-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000001'),
('dddddddd-0003-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000002'),
('dddddddd-0004-0000-0000-000000000001', 'cccccccc-0004-0000-0000-000000000001'),
('dddddddd-0004-0000-0000-000000000001', 'cccccccc-0004-0000-0000-000000000002');

-- 7. Seed Parent-Child Relationships
INSERT INTO parent_child_relationships (tree_id, parent_id, child_id, union_id, rel_type)
VALUES
-- Đời 1 -> Đời 2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000001', 'dddddddd-0001-0000-0000-000000000001', 'BIOLOGICAL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000001', 'dddddddd-0001-0000-0000-000000000001', 'BIOLOGICAL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000001', 'cccccccc-0002-0000-0000-000000000003', 'dddddddd-0001-0000-0000-000000000001', 'BIOLOGICAL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000002', 'cccccccc-0002-0000-0000-000000000003', 'dddddddd-0001-0000-0000-000000000001', 'BIOLOGICAL'),

-- Đời 2 -> Đời 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0002-0000-0000-000000000001', 'cccccccc-0003-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'BIOLOGICAL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0002-0000-0000-000000000002', 'cccccccc-0003-0000-0000-000000000001', 'dddddddd-0002-0000-0000-000000000001', 'BIOLOGICAL'),

-- Đời 3 -> Đời 4
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0003-0000-0000-000000000001', 'cccccccc-0004-0000-0000-000000000001', 'dddddddd-0003-0000-0000-000000000001', 'BIOLOGICAL'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0003-0000-0000-000000000002', 'cccccccc-0004-0000-0000-000000000001', 'dddddddd-0003-0000-0000-000000000001', 'BIOLOGICAL');

-- 8. Seed Clan Events
INSERT INTO clan_events (tree_id, related_person_id, title, event_type, date_lunar, location, description)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000001', 'Đại Lễ Giỗ Cụ Thủy Tổ Nguyễn Quý Công', 'ANCESTRAL_WORSHIP', '15/08 Âm lịch', 'Nhà Thờ Tổ Nguyễn Tộc, Cổ Đô, Ba Vì', 'Đại lễ giỗ Thủy Tổ họ Nguyễn hàng năm. Con cháu hội tụ dâng hương và khuyến học.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0001-0000-0000-000000000002', 'Ngày Kỵ Nhật Cụ Bà Lê Thị Diệu Thuần', 'DEATH_ANNIVERSARY', '06/03 Âm lịch', 'Từ Đường Nguyễn Tộc, Cổ Đô, Ba Vì', 'Lễ giỗ Cụ Bà Chính Thất Thủy Tổ.'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-0003-0000-0000-000000000001', 'Kỵ Nhật Cụ Nguyễn Văn Hòa (Đời 3)', 'DEATH_ANNIVERSARY', '12/03 Âm lịch', 'Nhà thờ Chi Trưởng, Ba Vì', 'Tưởng nhớ bậc tiền nhân có công đại tu Từ Đường dòng họ.');
