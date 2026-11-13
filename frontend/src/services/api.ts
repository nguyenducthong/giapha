import { FamilyTreeInfo, Person, Relationship } from '../types/genealogy';

const API_BASE = 'http://localhost:8080/api/v1';

export interface BackendGraphResponse {
  nodes: Person[];
  edges: Relationship[];
  totalMembers: number;
  livingCount: number;
  deceasedCount: number;
}

export interface BackendKinshipResponse {
  personA: Person;
  personB: Person;
  addressTermAtoB: string;
  addressTermBtoA: string;
  generationDifference: number;
  pathDescription: string;
  pathPersons: Person[];
}

export interface ClanArticle {
  id: string;
  treeId: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  createdAt: string;
}

export interface EditProposal {
  id: string;
  treeId: string;
  personId: string;
  personName: string;
  proposerName: string;
  fieldToChange: string;
  oldValue: string;
  newValue: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerNote?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  treeId: string;
  relatedPersonId?: string;
  title: string;
  mediaType: string;
  fileUrl: string;
  caption?: string;
  transcription?: string;
  location?: string;
  takenYear?: number;
  createdAt: string;
}

export interface ClanEvent {
  id: string;
  treeId: string;
  relatedPersonId?: string;
  title: string;
  eventType: string;
  dateLunar: string;
  dateSolar?: string;
  recurrenceAnnual: boolean;
  location?: string;
  description?: string;
  createdAt: string;
}

export const apiService = {
  async deletePerson(treeId: string, personId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/persons/${personId}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error('Không thể xóa thành viên trên máy chủ. Vui lòng thử lại.');
  },
  // 1. Lấy danh sách dòng họ
  async getTrees(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/family-trees`);
    if (!res.ok) throw new Error('Không thể tải danh sách dòng họ từ backend');
    return res.json();
  },

  // 2. Lấy dữ liệu đồ thị phả hệ cho React Flow từ Spring Boot backend
  async getTreeGraph(treeId: string): Promise<BackendGraphResponse> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/graph`);
    if (!res.ok) throw new Error('Không thể tải đồ thị phả hệ từ backend');
    return res.json();
  },

  // 3. Tra cứu xưng hô và quan hệ qua backend REST API
  async calculateKinship(treeId: string, fromId: string, toId: string): Promise<BackendKinshipResponse> {
    const res = await fetch(
      `${API_BASE}/family-trees/${treeId}/relationship-path?fromId=${fromId}&toId=${toId}`
    );
    if (!res.ok) throw new Error('Không thể tính toán xưng hô từ backend');
    return res.json();
  },

  // Cập nhật thông tin thành viên (bao gồm thông tin bên ngoại)
  async updatePerson(treeId: string, personId: string, person: Partial<Person>): Promise<Person> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/persons/${personId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    if (!res.ok) throw new Error('Không thể cập nhật thông tin thành viên');
    return res.json();
  },

  // 4. Đăng nhập JWT
  async login(email: string, password: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu');
    return res.json();
  },

  // 4.1 Đăng ký tài khoản mới
  async register(email: string, password: string, fullName: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });
    if (!res.ok) throw new Error('Đăng ký thất bại. Email có thể đã tồn tại');
    return res.json();
  },

  // 5. Phả Ký & Bài Viết
  async getArticles(treeId: string): Promise<ClanArticle[]> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/articles`);
    if (!res.ok) throw new Error('Không thể tải danh sách phả ký');
    return res.json();
  },

  async createArticle(treeId: string, article: Partial<ClanArticle>): Promise<ClanArticle> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (!res.ok) throw new Error('Không thể lưu phả ký');
    return res.json();
  },

  // 6. Đề xuất chỉnh sửa & Kiểm duyệt
  async getProposals(treeId: string): Promise<EditProposal[]> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/proposals`);
    if (!res.ok) throw new Error('Không thể tải danh sách đề xuất');
    return res.json();
  },

  async submitProposal(treeId: string, proposal: Partial<EditProposal>): Promise<EditProposal> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal),
    });
    if (!res.ok) throw new Error('Không thể gửi đề xuất chỉnh sửa');
    return res.json();
  },

  async reviewProposal(treeId: string, proposalId: string, status: 'APPROVED' | 'REJECTED', note?: string): Promise<EditProposal> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error('Không thể cập nhật trạng thái đề xuất');
    return res.json();
  },

  // 7. Kho tư liệu & Hình ảnh
  async getMedia(treeId: string): Promise<MediaAsset[]> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/media`);
    if (!res.ok) throw new Error('Không thể tải tư liệu dòng họ');
    return res.json();
  },

  async createMedia(treeId: string, media: Partial<MediaAsset>): Promise<MediaAsset> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media),
    });
    if (!res.ok) throw new Error('Không thể lưu tư liệu mới');
    return res.json();
  },

  async updateMedia(treeId: string, mediaId: string, media: Partial<MediaAsset>): Promise<MediaAsset> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/media/${mediaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media),
    });
    if (!res.ok) throw new Error('Không thể cập nhật tư liệu');
    return res.json();
  },

  async deleteMedia(treeId: string, mediaId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/media/${mediaId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Không thể xóa tư liệu');
  },

  // 8. Lịch Giỗ & Sự kiện
  async getEvents(treeId: string): Promise<ClanEvent[]> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/events`);
    if (!res.ok) throw new Error('Không thể tải lịch giỗ và sự kiện');
    return res.json();
  },

  // 9. Thêm mới thành viên phả hệ
  async createPerson(treeId: string, person: Partial<Person>): Promise<Person> {
    const res = await fetch(`${API_BASE}/family-trees/${treeId}/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        primaryName: person.fullName,
        courtesyName: person.courtesyName,
        gender: person.gender,
        generation: person.generation,
        branchName: person.branchName,
        status: person.status,
        birthYear: person.birthYear,
        deathYear: person.deathYear,
        lunarDeathDate: person.lunarDeathDate,
        tombLocation: person.tombLocation,
        currentResidence: person.currentResidence,
        biography: person.biography,
        orderInFamily: person.orderInFamily,
        avatarUrl: person.avatarUrl,
        lineage: person.isLineage,
      }),
    });
    if (!res.ok) throw new Error('Không thể lưu thành viên vào backend');
    return res.json();
  },
};

