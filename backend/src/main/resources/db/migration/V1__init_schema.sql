-- =============================================================================
-- GIA PHẢ VIỆT 4.0 - POSTGRESQL DATABASE SCHEMA (MIGRATION V1)
-- Triết lý: Multi-tenant theo tree_id, UUID v4, Tách rời Person và Relationships
-- Không sử dụng một trường parent_id đơn lẻ; hỗ trợ đa thê/đa phu, con nuôi,
-- không rõ cha mẹ, can chi âm lịch và bảo vệ quyền riêng tư người còn sống.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 2. FAMILY TREES (DÒNG HỌ / CÂY GIA PHẢ - TENANT ROOT)
-- -----------------------------------------------------------------------------
CREATE TABLE family_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    ancestral_hall VARCHAR(255),
    origin_place VARCHAR(255),
    founded_year INT,
    couplet_text TEXT,
    history_summary TEXT,
    patriarch_name VARCHAR(150),
    cover_image_url VARCHAR(500),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_family_trees_slug ON family_trees(slug) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 3. FAMILY TREE MEMBERSHIPS (VAI TRÒ & PHÂN QUYỀN TRONG DÒNG HỌ)
-- -----------------------------------------------------------------------------
CREATE TYPE clan_role AS ENUM (
    'SUPER_ADMIN',
    'CLAN_LEADER',     -- Trưởng họ / Chủ gia phả
    'BRANCH_MANAGER',  -- Quản lý chi
    'EDITOR',          -- Biên tập viên (ghi chép gia phả)
    'MEMBER',          -- Thành viên dòng họ
    'GUEST'            -- Khách được cấp quyền xem
);

CREATE TABLE family_tree_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role clan_role NOT NULL DEFAULT 'MEMBER',
    assigned_branch_id UUID,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tree_user UNIQUE (tree_id, user_id)
);

CREATE INDEX idx_memberships_tree ON family_tree_memberships(tree_id);
CREATE INDEX idx_memberships_user ON family_tree_memberships(user_id);

-- -----------------------------------------------------------------------------
-- 4. FAMILY BRANCHES (CHI, CÀNH, NHÁNH, PHÁI)
-- -----------------------------------------------------------------------------
CREATE TABLE family_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    parent_branch_id UUID REFERENCES family_branches(id) ON DELETE SET NULL,
    branch_name VARCHAR(150) NOT NULL,
    branch_order INT NOT NULL DEFAULT 1,
    origin_story TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_branches_tree ON family_branches(tree_id);

-- -----------------------------------------------------------------------------
-- 5. PERSONS (THÀNH VIÊN GIA TỘC - HỒ SƠ ĐỘC LẬP)
-- -----------------------------------------------------------------------------
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE life_status AS ENUM ('LIVING', 'DECEASED', 'UNKNOWN');

CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES family_branches(id) ON DELETE SET NULL,
    primary_name VARCHAR(150) NOT NULL,
    gender gender_type NOT NULL DEFAULT 'MALE',
    generation INT NOT NULL DEFAULT 1,
    status life_status NOT NULL DEFAULT 'LIVING',
    is_lineage BOOLEAN NOT NULL DEFAULT TRUE, -- Thuộc dòng máu họ chính hay dâu/rể
    order_in_family VARCHAR(80),               -- Trưởng nam, Thứ nam, Trưởng nữ...
    
    -- Ngày sinh / Ngày mất Dương lịch
    birth_year INT,
    birth_date DATE,
    death_year INT,
    death_date DATE,

    -- Ngày sinh / Ngày giỗ Âm lịch & Can Chi
    lunar_birth_date VARCHAR(60),
    lunar_death_date VARCHAR(60),             -- Ví dụ: 15/08 Âm lịch
    lunar_death_can_chi VARCHAR(50),          -- Giáp Tuất, Quý Mão...
    is_lunar_leap_month BOOLEAN DEFAULT FALSE,
    
    -- Địa lý & Phong tục
    birth_place VARCHAR(255),
    origin_place VARCHAR(255),
    current_residence VARCHAR(255),
    tomb_location VARCHAR(255),               -- Nơi an táng / mộ phần
    tomb_gps_latitude NUMERIC(10, 7),
    tomb_gps_longitude NUMERIC(10, 7),

    avatar_url VARCHAR(500),
    is_privacy_protected BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_persons_tree ON persons(tree_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_persons_branch ON persons(branch_id);
CREATE INDEX idx_persons_generation ON persons(tree_id, generation);
CREATE INDEX idx_persons_status ON persons(status);

-- -----------------------------------------------------------------------------
-- 6. PERSON NAMES (TÊN TỰ, TÊN HÚY, TÊN HIỆU, DANH XƯNG CỔ)
-- -----------------------------------------------------------------------------
CREATE TYPE name_type AS ENUM ('PRIMARY', 'BIRTH_NAME', 'COURTESY_NAME', 'POSTHUMOUS_NAME', 'NICKNAME');

CREATE TABLE person_names (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    name_type name_type NOT NULL DEFAULT 'PRIMARY',
    name_value VARCHAR(150) NOT NULL,
    chinese_script VARCHAR(100), -- Chữ Nho / Hán Nôm nếu có
    notes VARCHAR(255)
);

CREATE INDEX idx_person_names_person ON person_names(person_id);

-- -----------------------------------------------------------------------------
-- 7. UNIONS (MỐI QUAN HỆ HÔN PHỐI / VỢ CHỒNG - TÁCH RỜI)
-- -----------------------------------------------------------------------------
CREATE TABLE unions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    marriage_order INT NOT NULL DEFAULT 1,    -- 1: Chính thất, 2: Kế thất, 3: Thứ thất
    marriage_date DATE,
    marriage_place VARCHAR(255),
    divorce_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unions_tree ON unions(tree_id);

CREATE TABLE union_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    union_id UUID NOT NULL REFERENCES unions(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    role_in_union VARCHAR(50) NOT NULL DEFAULT 'SPOUSE',
    CONSTRAINT uq_union_person UNIQUE (union_id, person_id)
);

CREATE INDEX idx_union_partners_person ON union_partners(person_id);

-- -----------------------------------------------------------------------------
-- 8. PARENT-CHILD RELATIONSHIPS (QUAN HỆ HUYẾT THỐNG CHA MẸ - CON)
-- -----------------------------------------------------------------------------
CREATE TYPE parent_relationship_type AS ENUM ('BIOLOGICAL', 'ADOPTIVE', 'FOSTER', 'UNKNOWN');

CREATE TABLE parent_child_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    union_id UUID REFERENCES unions(id) ON DELETE SET NULL,
    rel_type parent_relationship_type NOT NULL DEFAULT 'BIOLOGICAL',
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_parent_child UNIQUE (parent_id, child_id),
    CONSTRAINT chk_no_self_parent CHECK (parent_id <> child_id)
);

CREATE INDEX idx_parent_child_tree ON parent_child_relationships(tree_id);
CREATE INDEX idx_parent_child_parent ON parent_child_relationships(parent_id);
CREATE INDEX idx_parent_child_child ON parent_child_relationships(child_id);

-- -----------------------------------------------------------------------------
-- 9. BIOGRAPHIES & ACHIEVEMENTS (TIỂU SỬ, CÔNG TRẠNG, HỌC VỊ)
-- -----------------------------------------------------------------------------
CREATE TABLE biographies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    summary TEXT,
    full_story TEXT,
    achievements TEXT[], -- Mảng công trạng, bằng sắc, chức tước
    titles TEXT[],       -- Thủy Tổ, Trưởng Tộc, Tiên Hiền...
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_biographies_person ON biographies(person_id);

-- -----------------------------------------------------------------------------
-- 10. CLAN EVENTS (LỊCH ÂM DƯƠNG, KỴ NHẬT, ĐẠI LỄ TẾ TỔ, HỌC BỔNG)
-- -----------------------------------------------------------------------------
CREATE TYPE clan_event_type AS ENUM (
    'DEATH_ANNIVERSARY',     -- Ngày giỗ
    'ANCESTRAL_WORSHIP',    -- Đại lễ tế tổ
    'CLAN_MEETING',         -- Họp họ / Hội đồng gia tộc
    'LONGEVITY_CELEBRATION',-- Mừng thọ
    'SCHOLARSHIP_EVENT'     -- Khuyến học
);

CREATE TABLE clan_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    related_person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    event_type clan_event_type NOT NULL DEFAULT 'DEATH_ANNIVERSARY',
    date_lunar VARCHAR(60) NOT NULL,
    date_solar DATE,
    recurrence_annual BOOLEAN NOT NULL DEFAULT TRUE,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clan_events_tree ON clan_events(tree_id);

-- -----------------------------------------------------------------------------
-- 11. AUDIT LOGS & PROPOSALS (LỊCH SỬ THAY ĐỔI & ĐỀ XUẤT CHỈNH SỬA)
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(60) NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tree ON audit_logs(tree_id, created_at DESC);
