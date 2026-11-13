export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type LifeStatus = 'LIVING' | 'DECEASED' | 'UNKNOWN';

export interface Person {
  id: string;
  treeId: string;
  fullName: string;
  commonName?: string;
  courtesyName?: string; // Tên tự / Tên húy / Tên hiệu
  gender: Gender;
  generation: number; // Đời thứ 1, 2, 3...
  branchName: string; // Chi, cành, nhánh
  birthYear?: number;
  deathYear?: number;
  solarBirthDate?: string;
  solarDeathDate?: string;
  lunarBirthDate?: string;
  lunarDeathDate?: string; // Ngày giỗ âm lịch, ví dụ "15/08 Âm lịch"
  lunarDeathCanChi?: string; // Năm Can Chi (ví dụ: Giáp Thìn, Quý Mão)
  status: LifeStatus;
  isLineage: boolean; // Thuộc dòng máu họ tộc chính (true) hay dâu/rể (false)
  orderInFamily?: string; // Trưởng nam, Thứ nam, Tam nam, Trưởng nữ...
  avatarUrl?: string;
  birthPlace?: string;
  originPlace?: string; // Nguyên quán
  currentResidence?: string;
  tombLocation?: string; // Mộ phần / Vĩnh hằng viên

  // Gốc tích bên ngoại & thông tin Dâu / Rể
  maternalClanName?: string;     // Dòng họ bên ngoại (ví dụ: Lê Tộc, Trần Tộc)
  maternalOriginPlace?: string;  // Quê ngoại / Bản quán bên ngoại
  maternalFather?: string;       // Cụ Thân Sinh bên ngoại (Ông Ngoại)
  maternalMother?: string;       // Cụ Thân Sinh bên ngoại (Bà Ngoại)
  maternalNotes?: string;        // Ghi chú thân thế bên ngoại

  biography?: string;
  achievements?: string[]; // Công trạng, học vị, chức sắc
  titles?: string[]; // Thủy Tổ, Trưởng Tộc, Tiên Hiền...
}

export type RelationshipType = 
  | 'MARRIAGE'            // Vợ / Chồng
  | 'BIOLOGICAL_PARENT'   // Cha / Mẹ ruột
  | 'ADOPTIVE_PARENT';    // Cha / Mẹ nuôi

export interface Relationship {
  id: string;
  treeId: string;
  type: RelationshipType;
  fromPersonId: string;
  toPersonId: string;
  notes?: string;
  marriageOrder?: number; // 1: Chính thất, 2: Kế thất, 3: Thứ thất
}

export interface ClanEvent {
  id: string;
  title: string;
  dateLunar: string;
  dateSolar: string;
  type: 'DEATH_ANNIVERSARY' | 'ANCESTRAL_WORSHIP' | 'CLAN_MEETING' | 'LONGEVITY_CELEBRATION';
  location: string;
  description: string;
  relatedPersonId?: string;
}

export interface ClanArticle {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  category: 'PHA_KY' | 'DI_TICH' | 'DANH_NHAN' | 'TOC_UOC';
  excerpt: string;
  content: string;
  coverImage?: string;
}

export interface FamilyTreeInfo {
  id: string;
  name: string;
  ancestralHall: string; // Nhà thờ tổ
  ancestorName: string; // Thủy tổ khai sáng
  originPlace: string; // Quê quán, quê tổ
  foundedYear: number;
  totalGenerations: number;
  totalMembers: number;
  livingCount: number;
  deceasedCount: number;
  maleCount: number;
  femaleCount: number;
  branchesCount: number;
  coupletText: string; // Câu đối cội nguồn
  patriarchName: string; // Trưởng tộc đương nhiệm
  historySummary: string;
}
