import React, { useState, useEffect } from 'react';
import { 
  mockTreeInfo, mockPersons, mockRelationships, mockEvents, 
  mockArticles, mockProposals, mockMediaAssets 
} from './data/mockData';
import { Person, Relationship, FamilyTreeInfo } from './types/genealogy';
import { apiService, BackendGraphResponse } from './services/api';
import { ClanPublicPortal } from './components/public/ClanPublicPortal';
import { ClanDashboard } from './components/dashboard/ClanDashboard';
import { GenealogyTreeCanvas } from './components/tree/GenealogyTreeCanvas';
import { MemberProfileDrawer } from './components/profile/MemberProfileDrawer';
import { ConnectRelationshipModal } from './components/tree/ConnectRelationshipModal';
import { KinshipFinderModal } from './components/kinship/KinshipFinderModal';
import { EditProposalModal } from './components/collaboration/EditProposalModal';
import { DigitalArchiveGallery } from './components/media/DigitalArchiveGallery';
import { LunarCalendarModal } from './components/events/LunarCalendarModal';
import { TreeExportModal } from './components/export/TreeExportModal';
import { InviteMemberModal } from './components/collaboration/InviteMemberModal';
import { AddMemberModal } from './components/profile/AddMemberModal';
import { EditMemberModal } from './components/profile/EditMemberModal';
import { EditClanPortalModal } from './components/public/EditClanPortalModal';
import { AuthModal } from './components/auth/AuthModal';
import { ClanAuthGate } from './components/auth/ClanAuthGate';
import { ClanWorkspaceModal } from './components/collaboration/ClanWorkspaceModal';
import { ClanArticle, ClanEvent, EditProposal, MediaAsset } from './services/api';
import { 
  Building2, LayoutDashboard, GitFork, Compass, Menu, 
  X, Sparkles, Database, CheckCircle2, AlertCircle, LogIn, LogOut,
  Calendar, BookOpen, ShieldAlert, Printer, UserPlus
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'dashboard' | 'tree'>('portal');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isKinshipModalOpen, setIsKinshipModalOpen] = useState<boolean>(false);
  const [kinshipInitialPerson, setKinshipInitialPerson] = useState<Person | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modals for Collaboration & Advanced Features
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [mediaFilterPersonId, setMediaFilterPersonId] = useState<string | null>(null);
  const [mediaUploadPersonId, setMediaUploadPersonId] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
  const [addMemberTargetPerson, setAddMemberTargetPerson] = useState<Person | null>(null);
  const [isGlobalConnectModalOpen, setIsGlobalConnectModalOpen] = useState<boolean>(false);
  const [connectModalInitialPerson, setConnectModalInitialPerson] = useState<Person | null>(null);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState<boolean>(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [isEditPortalModalOpen, setIsEditPortalModalOpen] = useState<boolean>(false);
  const [editedTreeInfo, setEditedTreeInfo] = useState<FamilyTreeInfo | null>(null);
  const [editedPersons, setEditedPersons] = useState<Person[] | null>(() => {
    try {
      const saved = localStorage.getItem('giapha_edited_persons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return null;
  });
  const [proposals, setProposals] = useState<EditProposal[]>(mockProposals as EditProposal[]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('giapha_media_assets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage parse error
    }
    return mockMediaAssets as MediaAsset[];
  });
  const [clanEvents, setClanEvents] = useState<ClanEvent[]>(mockEvents as any[]);

  // Backend Database & Multi-Clan State
  const [backendTreeInfo, setBackendTreeInfo] = useState<FamilyTreeInfo | null>(null);
  const [availableTrees, setAvailableTrees] = useState<FamilyTreeInfo[]>([mockTreeInfo]);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);
  const [backendPersons, setBackendPersons] = useState<Person[]>([]);
  const [backendRelationships, setBackendRelationships] = useState<Relationship[]>(() => {
    try {
      const saved = localStorage.getItem('giapha_relationships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return mockRelationships;
  });
  const [backendLoading, setBackendLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Auth State & Identity Linking ("Tôi" trên phả đồ)
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('giapha_auth_token');
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('giapha_current_user');
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [myPersonId, setMyPersonId] = useState<string | null>(() => {
    return localStorage.getItem('giapha_my_person_id') || 'p-05';
  });

  // Load backend data from Spring Boot REST API
  useEffect(() => {
    setBackendLoading(true);
    setBackendError(null);
    apiService.getTrees()
      .then((trees) => {
        if (trees && trees.length > 0) {
          const mappedTrees: FamilyTreeInfo[] = trees.map((t: any) => ({
            id: t.id,
            name: t.name,
            ancestralHall: t.ancestralHall || mockTreeInfo.ancestralHall,
            ancestorName: mockTreeInfo.ancestorName,
            originPlace: t.originPlace || mockTreeInfo.originPlace,
            foundedYear: t.foundedYear || 1682,
            totalGenerations: 4,
            totalMembers: 6,
            livingCount: 1,
            deceasedCount: 5,
            maleCount: 5,
            femaleCount: 1,
            branchesCount: 2,
            coupletText: t.coupletText || mockTreeInfo.coupletText,
            patriarchName: t.patriarchName || mockTreeInfo.patriarchName,
            historySummary: t.historySummary || mockTreeInfo.historySummary,
          }));
          setAvailableTrees(mappedTrees);
          const activeTree = mappedTrees[0];
          // Fetch collaboration data if present in backend
          apiService.getProposals(activeTree.id).then((p) => { if (p && p.length > 0) setProposals(p); }).catch(() => {});
          apiService.getMedia(activeTree.id).then((m) => { if (m && m.length > 0) setMediaAssets(m); }).catch(() => {});
          apiService.getEvents(activeTree.id).then((ev) => { if (ev && ev.length > 0) setClanEvents(ev); }).catch(() => {});

          return apiService.getTreeGraph(activeTree.id);
        }
        throw new Error('Chưa có cây gia phả nào trong database backend');
      })
      .then((graph: BackendGraphResponse) => {
        // Format persons and relationships from backend
        const formattedPersons: Person[] = graph.nodes.map((n: any) => ({
          id: n.id,
          treeId: n.treeId,
          fullName: n.primaryName,
          courtesyName: n.courtesyName,
          gender: n.gender,
          generation: n.generation,
          branchName: n.branchName || 'Chi Trưởng',
          birthYear: n.birthYear,
          deathYear: n.deathYear,
          lunarDeathDate: n.lunarDeathDate,
          lunarDeathCanChi: n.lunarDeathCanChi,
          status: n.status,
          isLineage: n.lineage,
          orderInFamily: n.orderInFamily,
          avatarUrl: n.avatarUrl,
          birthPlace: n.birthPlace,
          tombLocation: n.tombLocation,
          biography: n.biography,
        }));

        const formattedEdges: Relationship[] = graph.edges.map((e: any) => ({
          id: e.id,
          treeId: e.treeId,
          type: e.relType === 'BIOLOGICAL' ? 'BIOLOGICAL_PARENT' : 'MARRIAGE',
          fromPersonId: e.parentId,
          toPersonId: e.childId,
        }));

        setBackendPersons(formattedPersons);
        setBackendRelationships(formattedEdges);
        setBackendLoading(false);
      })
      .catch((err) => {
        console.warn('Backend API call warning:', err.message);
        setBackendError(err.message);
        setBackendLoading(false);
      });
  }, []);

  // Current active data set directly from Backend Database or in-memory updates
  const baseTreeInfo = backendTreeInfo || mockTreeInfo;
  const currentTreeInfo = editedTreeInfo || baseTreeInfo;
  const basePersons = backendPersons.length > 0 ? backendPersons : mockPersons;
  const currentPersons = editedPersons || basePersons;
  const currentRelationships = backendRelationships.filter(r =>
    currentPersons.some(p => p.id === r.fromPersonId) && currentPersons.some(p => p.id === r.toPersonId));

  const handleDeletePerson = async (person: Person) => {
    const nextPersons = currentPersons.filter(p => p.id !== person.id);
    const nextRelationships = currentRelationships.filter(r => r.fromPersonId !== person.id && r.toPersonId !== person.id);
    const keys = ['giapha_edited_persons', 'giapha_relationships'];
    const previous = keys.map(key => localStorage.getItem(key));
    try {
      localStorage.setItem(keys[0], JSON.stringify(nextPersons));
      localStorage.setItem(keys[1], JSON.stringify(nextRelationships));
      // Locally imported and demonstration members may have no server record.
      if (!backendError && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(person.id) && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(person.treeId)) {
        await apiService.deletePerson(person.treeId, person.id);
      }
    } catch (error) {
      keys.forEach((key, index) => { if (previous[index] === null) localStorage.removeItem(key); else localStorage.setItem(key, previous[index]!); });
      throw error;
    }
    setEditedPersons(nextPersons);
    setBackendPersons(nextPersons);
    setBackendRelationships(nextRelationships);
    setSelectedPerson(null);
    if (myPersonId === person.id) { setMyPersonId(null); localStorage.removeItem('giapha_my_person_id'); }
    setKinshipInitialPerson(null);
    setIsKinshipModalOpen(false);
    setAddMemberTargetPerson(null);
    setConnectModalInitialPerson(null);
    setPersonToEdit(null);
  };

  const handleOpenKinship = (person?: Person) => {
    setKinshipInitialPerson(person || selectedPerson || currentPersons[currentPersons.length - 1]);
    setIsKinshipModalOpen(true);
  };

  const handleProposalUpdated = () => {
    if (backendTreeInfo) {
      apiService.getProposals(backendTreeInfo.id).then((p) => { if (p && p.length > 0) setProposals(p); }).catch(() => {});
    }
  };

  const handleExcelImport = (persons: Person[], relationships: Relationship[]) => {
    const existingIds = new Set(currentPersons.map(p => p.id));
    if (persons.some(p => existingIds.has(p.id))) throw new Error('ID thành viên đã tồn tại. Vui lòng kiểm tra lại tệp.');
    const nextPersons = [...currentPersons, ...persons];
    const nextRelationships = [...currentRelationships, ...relationships];
    // Persist before changing the visible graph so storage failures cannot report success.
    const previousPersons = localStorage.getItem('giapha_edited_persons');
    try {
      localStorage.setItem('giapha_edited_persons', JSON.stringify(nextPersons));
      localStorage.setItem('giapha_relationships', JSON.stringify(nextRelationships));
    } catch {
      if (previousPersons === null) localStorage.removeItem('giapha_edited_persons');
      else localStorage.setItem('giapha_edited_persons', previousPersons);
      throw new Error('Không đủ dung lượng trình duyệt để lưu dữ liệu nhập.');
    }
    setEditedPersons(nextPersons);
    setBackendPersons(nextPersons);
    setBackendRelationships(nextRelationships);
  };

  const handleMemberAdded = (newPerson: Person, newRelationship?: Relationship) => {
    const nextPersons = [...currentPersons, newPerson];
    setEditedPersons(nextPersons);
    setBackendPersons((prev) => [...prev, newPerson]);
    if (newRelationship) {
      setBackendRelationships((prev) => [...prev, newRelationship]);
    }
    if (backendTreeInfo) {
      apiService.createPerson(backendTreeInfo.id, newPerson).catch((err) => {
        console.warn('Backend API save warning:', err);
      });
    }
    setSelectedPerson(newPerson);
  };

  const handleMemberUpdated = (updatedPerson: Person) => {
    const nextPersons = currentPersons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p));
    setEditedPersons(nextPersons);
    setBackendPersons((prev) => prev.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)));
    setSelectedPerson(updatedPerson);
    try {
      localStorage.setItem('giapha_edited_persons', JSON.stringify(nextPersons));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    if (backendTreeInfo) {
      apiService.updatePerson(backendTreeInfo.id, updatedPerson.id, updatedPerson).catch((err) => {
        console.warn('Backend API update warning:', err);
      });
    }
  };

  const handleUpdateTreeInfo = (updatedTree: FamilyTreeInfo) => {
    setEditedTreeInfo(updatedTree);
    setAvailableTrees((prev) => prev.map((t) => (t.id === updatedTree.id ? updatedTree : t)));
  };

  const handleSaveRelationship = (newRel: Relationship, updatedPersons?: Person[]) => {
    const nextRels = [newRel, ...backendRelationships.filter((r) => r.id !== newRel.id)];
    setBackendRelationships(nextRels);
    try {
      localStorage.setItem('giapha_relationships', JSON.stringify(nextRels));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (updatedPersons && updatedPersons.length > 0) {
      const nextPersons = currentPersons.map((p) => {
        const found = updatedPersons.find((up) => up.id === p.id);
        return found || p;
      });
      setEditedPersons(nextPersons);
      setBackendPersons(nextPersons);
    }
  };

  const handleDeleteRelationship = (relationshipId: string) => {
    const nextRels = backendRelationships.filter((r) => r.id !== relationshipId);
    setBackendRelationships(nextRels);
    try {
      localStorage.setItem('giapha_relationships', JSON.stringify(nextRels));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const persistMediaList = (nextList: MediaAsset[]) => {
    setMediaAssets(nextList);
    try {
      localStorage.setItem('giapha_media_assets', JSON.stringify(nextList));
    } catch (e) {
      console.warn('LocalStorage quota warning for media:', e);
    }
  };

  const handleAddMedia = (newMediaData: Omit<MediaAsset, 'id' | 'createdAt'>) => {
    const newItem: MediaAsset = {
      ...newMediaData,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const nextList = [newItem, ...mediaAssets];
    persistMediaList(nextList);
    if (backendTreeInfo) {
      apiService.createMedia(backendTreeInfo.id, newMediaData).catch(() => {});
    }
  };

  const handleUpdateMedia = (updatedItem: MediaAsset) => {
    const nextList = mediaAssets.map((m) => (m.id === updatedItem.id ? updatedItem : m));
    persistMediaList(nextList);
    if (backendTreeInfo) {
      apiService.updateMedia(backendTreeInfo.id, updatedItem.id, updatedItem).catch(() => {});
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    const nextList = mediaAssets.filter((m) => m.id !== mediaId);
    persistMediaList(nextList);
    if (backendTreeInfo) {
      apiService.deleteMedia(backendTreeInfo.id, mediaId).catch(() => {});
    }
  };

  const handleSetPersonAvatarFromMedia = (personId: string, fileUrl: string) => {
    const target = currentPersons.find((p) => p.id === personId);
    if (target) {
      handleMemberUpdated({ ...target, avatarUrl: fileUrl });
    }
  };

  const handleAuthSuccess = (token: string, fullName: string, linkedPersonId?: string) => {
    setAuthToken(token);
    setCurrentUser(fullName);
    localStorage.setItem('giapha_auth_token', token);
    localStorage.setItem('giapha_current_user', fullName);
    if (linkedPersonId) {
      setMyPersonId(linkedPersonId);
      localStorage.setItem('giapha_my_person_id', linkedPersonId);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('giapha_auth_token');
    localStorage.removeItem('giapha_current_user');
  };

  const handleClaimProfile = (person: Person) => {
    setMyPersonId(person.id);
    localStorage.setItem('giapha_my_person_id', person.id);
    alert(`Đã liên kết tài khoản của bạn với thành viên: ${person.fullName}! Trên phả đồ sẽ hiển thị huy hiệu "Tôi (Chính bạn)" và hệ thống sẽ tự động lấy đây làm gốc xưng hô.`);
  };

  const handleSelectTree = (tree: FamilyTreeInfo) => {
    setEditedTreeInfo(null);
    setEditedPersons(null);
    setBackendTreeInfo(tree);
    apiService.getTreeGraph(tree.id).then((graph) => {
      const formattedPersons: Person[] = graph.nodes.map((n: any) => ({
        id: n.id,
        treeId: n.treeId,
        fullName: n.primaryName,
        courtesyName: n.courtesyName,
        gender: n.gender,
        generation: n.generation,
        branchName: n.branchName || 'Chi Trưởng',
        birthYear: n.birthYear,
        deathYear: n.deathYear,
        lunarDeathDate: n.lunarDeathDate,
        lunarDeathCanChi: n.lunarDeathCanChi,
        status: n.status,
        isLineage: n.lineage,
        orderInFamily: n.orderInFamily,
        avatarUrl: n.avatarUrl,
        birthPlace: n.birthPlace,
        tombLocation: n.tombLocation,
        biography: n.biography,
      }));
      const formattedEdges: Relationship[] = graph.edges.map((e: any) => ({
        id: e.id,
        treeId: e.treeId,
        type: e.relType === 'BIOLOGICAL' ? 'BIOLOGICAL_PARENT' : 'MARRIAGE',
        fromPersonId: e.parentId,
        toPersonId: e.childId,
      }));
      setBackendPersons(formattedPersons);
      setBackendRelationships(formattedEdges);
    }).catch(() => {});
  };

  const handleCreateTree = (treeData: any) => {
    const newTree: FamilyTreeInfo = {
      id: `tree-${Date.now()}`,
      name: treeData.name,
      ancestralHall: treeData.ancestralHall,
      ancestorName: currentUser || 'Thủy Tổ Khai Sáng',
      originPlace: treeData.originPlace,
      foundedYear: treeData.foundedYear,
      totalGenerations: 1,
      totalMembers: 1,
      livingCount: 1,
      deceasedCount: 0,
      maleCount: 1,
      femaleCount: 0,
      branchesCount: 1,
      coupletText: treeData.coupletText,
      patriarchName: `${currentUser} (Trưởng Tộc)`,
      historySummary: `Khởi lập bởi ${currentUser} năm ${new Date().getFullYear()}.`,
    };
    setAvailableTrees((prev) => [...prev, newTree]);
    setBackendTreeInfo(newTree);
    const newAncestor: Person = {
      id: `p-${Date.now()}`,
      treeId: newTree.id,
      fullName: currentUser || 'Thủy Tổ Khai Sáng',
      gender: 'MALE',
      generation: 1,
      branchName: 'Chi Trưởng',
      status: 'LIVING',
      isLineage: true,
      orderInFamily: 'Trưởng Tộc',
    };
    setBackendPersons([newAncestor]);
    setBackendRelationships([]);
    setSelectedPerson(newAncestor);
    setMyPersonId(newAncestor.id);
  };

  const handleJoinByCode = (inviteCode: string): boolean => {
    const code = inviteCode.trim().toUpperCase();
    if (code === 'NGUYEN-CODO-8821' || code === 'INV-8821') {
      return true;
    }
    if (code === 'TRAN-THIENTRUONG-7712' || code === 'INV-TRAN') {
      const tranTree: FamilyTreeInfo = {
        id: 'tree-tran-01',
        name: 'Gia Phả Họ Trần – Phủ Thiên Trường',
        ancestralHall: 'Đền Trần – Nam Định',
        ancestorName: 'Đức Thái Tổ Trần Thừa',
        originPlace: 'Mỹ Lộc, Nam Định',
        foundedYear: 1225,
        totalGenerations: 5,
        totalMembers: 12,
        livingCount: 8,
        deceasedCount: 4,
        maleCount: 7,
        femaleCount: 5,
        branchesCount: 3,
        coupletText: 'Hào khí Đông A lưu vạn thuở – Hậu thế quang vinh rạng giang sơn',
        patriarchName: 'Ông Trần Quốc Toản',
        historySummary: 'Dòng dõi danh gia vọng tộc hào khí Đông A lẫy lừng.',
      };
      setAvailableTrees((prev) => prev.some(t => t.id === tranTree.id) ? prev : [...prev, tranTree]);
      handleSelectTree(tranTree);
      return true;
    }
    return false;
  };

  const ancestor = currentPersons[0] || mockPersons[0];
  const patriarch = currentPersons.find(p => p.orderInFamily?.includes('Trưởng Tộc')) || currentPersons[0];

  // BẢO MẬT GIA TỘC: Chưa đăng nhập KHÔNG hiển thị cây phả hệ hoặc thông tin dòng họ
  if (!currentUser) {
    return (
      <ClanAuthGate
        clanName={currentTreeInfo.name}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-heritage-canvas text-heritage-ink flex flex-col font-sans">
      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-heritage-border shadow-heritage-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-heritage-crimson to-heritage-crimsonDark flex items-center justify-center text-white shadow-md border border-heritage-gold/40 group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-bold">GP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold text-heritage-crimson tracking-tight">
                  Gia Phả Việt
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-heritage-gold/20 text-heritage-goldMuted rounded border border-heritage-gold/30">
                  4.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[10px] text-heritage-inkMuted truncate max-w-[140px] sm:max-w-[200px]">
                  {currentTreeInfo.name}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsWorkspaceModalOpen(true); }}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-heritage-parchment hover:bg-amber-100 text-heritage-crimson border border-heritage-gold/40 flex items-center gap-1 transition-colors shadow-xs"
                  title="Chuyển đổi dòng họ hoặc nhập mã mời tham gia"
                >
                  <span>🔁 Đổi Họ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-heritage-crimson text-white shadow-sm'
                  : 'text-heritage-ink hover:bg-heritage-parchment'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Bảng Quản Trị
            </button>

            <button
              onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tree'
                  ? 'bg-heritage-crimson text-white shadow-sm'
                  : 'text-heritage-ink hover:bg-heritage-parchment'
              }`}
            >
              <GitFork className="w-4 h-4" />
              Cây Phả Hệ Trực Quan
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'portal'
                  ? 'bg-heritage-crimson text-white shadow-sm'
                  : 'text-heritage-ink hover:bg-heritage-parchment'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Trang Giới Thiệu Dòng Họ
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleOpenKinship()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-heritage-moss/40 bg-[#EBF1ED] text-heritage-moss text-xs font-bold hover:bg-heritage-moss hover:text-white transition-all shadow-xs"
              title="Tra cứu danh xưng & quan hệ thân tộc"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tra Xưng Hô</span>
            </button>

            <button
              onClick={() => setIsCalendarModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-heritage-border bg-white text-heritage-ink text-xs font-semibold hover:border-heritage-gold hover:text-heritage-crimson transition-all shadow-xs"
              title="Lịch giỗ chạp âm lịch dòng họ"
            >
              <Calendar className="w-3.5 h-3.5 text-heritage-crimson" />
              <span className="hidden xl:inline">Lịch Giỗ</span>
            </button>

            <button
              onClick={() => {
                setMediaFilterPersonId(null);
                setMediaUploadPersonId(null);
                setIsMediaModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-heritage-border bg-white text-heritage-ink text-xs font-semibold hover:border-heritage-gold hover:text-heritage-crimson transition-all shadow-xs"
              title="Thư viện tư liệu số hóa & ảnh cổ"
            >
              <BookOpen className="w-3.5 h-3.5 text-heritage-crimson" />
              <span className="hidden xl:inline">Tư Liệu</span>
              <span className="px-1.5 py-0.2 rounded-full bg-heritage-parchment text-heritage-crimson text-[10px] font-bold border border-heritage-gold/40">
                {mediaAssets.length}
              </span>
            </button>

            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-heritage-border bg-white text-heritage-ink text-xs font-semibold hover:border-heritage-gold hover:text-heritage-crimson transition-all shadow-xs"
              title="Đề xuất bổ sung & chỉnh sửa phả hệ"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-heritage-crimson" />
              <span className="hidden xl:inline">Đề Xuất</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-heritage-gold bg-[#FAF4EB] text-heritage-goldDark text-xs font-bold hover:bg-heritage-gold hover:text-white transition-all shadow-xs"
              title="Xuất bản phả đồ PDF / hình ảnh khổ lớn"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Xuất Bản & In</span>
            </button>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-700 hover:text-white transition-all shadow-xs"
              title="Tạo link mời thành viên và phân quyền gia tộc"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mời Thành Viên</span>
            </button>

            <div className="h-6 w-px bg-heritage-border mx-1"></div>
            {/* Header User Profile Section */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-heritage-ink bg-heritage-parchment/80 py-1.5 px-3 rounded-xl border border-heritage-gold/50 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-heritage-crimson flex items-center justify-center font-bold text-white text-[11px] shadow-xs">
                  {currentUser.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-heritage-crimson hidden xl:inline">{currentUser}</span>
                {myPersonId && currentPersons.find(p => p.id === myPersonId) && (
                  <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-300">
                    Tôi: {currentPersons.find(p => p.id === myPersonId)?.fullName}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-heritage-crimson rounded-lg transition-colors flex items-center gap-1 text-xs"
                title="Đăng xuất (Khóa bảo mật)"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden 2xl:inline text-xs font-semibold">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleOpenKinship()}
              className="p-2 rounded-lg bg-heritage-parchment text-heritage-moss text-xs"
              title="Tra Xưng Hô"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-heritage-ink hover:bg-heritage-parchment"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-heritage-crimson" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-heritage-border bg-white p-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'dashboard' ? 'bg-heritage-crimson text-white' : 'text-heritage-ink'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Bảng Quản Trị
            </button>
            <button
              onClick={() => { setActiveTab('tree'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'tree' ? 'bg-heritage-crimson text-white' : 'text-heritage-ink'
              }`}
            >
              <GitFork className="w-4 h-4" />
              Cây Phả Hệ Trực Quan
            </button>
            <button
              onClick={() => { setActiveTab('portal'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'portal' ? 'bg-heritage-crimson text-white' : 'text-heritage-ink'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Trang Giới Thiệu Dòng Họ
            </button>

            <div className="pt-2 border-t border-heritage-border space-y-1.5">
              <button
                onClick={() => { setIsCalendarModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-heritage-ink hover:bg-heritage-parchment"
              >
                <Calendar className="w-4 h-4 text-heritage-crimson" />
                Lịch Giỗ & Sự Kiện Âm Lịch
              </button>
              <button
                onClick={() => { setIsMediaModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-heritage-ink hover:bg-heritage-parchment"
              >
                <BookOpen className="w-4 h-4 text-heritage-crimson" />
                Tư Liệu Số Hóa & Sắc Phong
              </button>
              <button
                onClick={() => { setIsProposalModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-heritage-ink hover:bg-heritage-parchment"
              >
                <ShieldAlert className="w-4 h-4 text-heritage-crimson" />
                Đề Xuất Chỉnh Sửa Phả Hệ
              </button>
              <button
                onClick={() => { setIsExportModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-heritage-goldDark bg-[#FAF4EB]"
              >
                <Printer className="w-4 h-4" />
                Xuất Bản & In Phả Đồ Khổ Lớn
              </button>
              <button
                onClick={() => { setIsInviteModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50"
              >
                <UserPlus className="w-4 h-4 text-emerald-700" />
                Mời Thành Viên & Phân Quyền
              </button>
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-heritage-border">
              <div className="flex items-center justify-between p-2 bg-heritage-parchment rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">{currentUser}</span>
                  {myPersonId && currentPersons.find(p => p.id === myPersonId) && (
                    <span className="text-[10px] text-amber-800 font-semibold">
                      (Tôi: {currentPersons.find(p => p.id === myPersonId)?.fullName})
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-heritage-crimson text-xs underline font-bold"
                >
                  Đăng xuất (Khóa)
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'portal' && (
          <ClanPublicPortal
            treeInfo={currentTreeInfo}
            ancestor={ancestor}
            patriarch={patriarch}
            articles={mockArticles}
            events={clanEvents as any}
            onExploreTree={() => setActiveTab('tree')}
            onOpenKinshipFinder={() => handleOpenKinship()}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onEditPortal={() => setIsEditPortalModalOpen(true)}
            currentUser={currentUser}
            myPersonName={currentPersons.find(p => p.id === myPersonId)?.fullName}
          />
        )}

        {activeTab === 'dashboard' && (
          <ClanDashboard
            treeInfo={currentTreeInfo}
            persons={currentPersons}
            events={mockEvents}
            onNavigateToTree={() => setActiveTab('tree')}
            onSelectPerson={(person) => setSelectedPerson(person)}
            onOpenKinshipFinder={(person) => handleOpenKinship(person)}
          />
        )}

        {activeTab === 'tree' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-heritage-crimson flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-heritage-gold" />
                  Cây Phả Hệ Dòng Họ Tương Tác
                </h2>
                <p className="text-xs text-heritage-inkMuted">
                  🟢 Dữ liệu thời gian thực từ Cơ sở dữ liệu Dòng họ • Dàn trang tự động ELK.js • Kéo để di chuyển • Cuộn để thu phóng
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAddMemberTargetPerson(selectedPerson || currentPersons[0]);
                    setIsAddMemberModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-heritage-crimson to-heritage-crimsonDark hover:from-heritage-crimsonDark hover:to-heritage-crimson text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-[#E5C378]" />
                  + Thêm Thành Viên
                </button>
                <button
                  onClick={() => handleOpenKinship()}
                  className="px-3 py-2 bg-heritage-moss hover:bg-heritage-mossLight text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  Tra Xưng Hô
                </button>
              </div>
            </div>

            <GenealogyTreeCanvas
              persons={currentPersons}
              relationships={currentRelationships}
              onSelectPerson={(person) => setSelectedPerson(person)}
              selectedPerson={selectedPerson}
              onOpenKinshipFinder={(person) => handleOpenKinship(person)}
              onOpenConnectModal={(person) => {
                setConnectModalInitialPerson(person);
                setIsGlobalConnectModalOpen(true);
              }}
              onSaveRelationship={handleSaveRelationship}
              onDeleteRelationship={handleDeleteRelationship}
              myPersonId={myPersonId}
            />
          </div>
        )}
      </main>

      {/* Member Profile Drawer */}
      <MemberProfileDrawer
        key={selectedPerson?.id ?? 'closed'}
        onDeletePerson={handleDeletePerson}
        person={selectedPerson}
        allPersons={currentPersons}
        allRelationships={currentRelationships}
        mediaAssets={mediaAssets}
        onClose={() => setSelectedPerson(null)}
        onSelectPerson={(person) => setSelectedPerson(person)}
        onOpenKinshipFinder={(person) => handleOpenKinship(person)}
        onAddRelative={(relPerson) => {
          setAddMemberTargetPerson(relPerson);
          setIsAddMemberModalOpen(true);
        }}
        onConnectRelationship={(person) => {
          setConnectModalInitialPerson(person);
          setIsGlobalConnectModalOpen(true);
        }}
        onEditPerson={(person) => {
          setPersonToEdit(person);
          setIsEditMemberModalOpen(true);
        }}
        onOpenPersonMedia={(person) => {
          setMediaFilterPersonId(person.id);
          setMediaUploadPersonId(null);
          setIsMediaModalOpen(true);
        }}
        onUploadPersonMedia={(person) => {
          setMediaFilterPersonId(person.id);
          setMediaUploadPersonId(person.id);
          setIsMediaModalOpen(true);
        }}
        isMe={selectedPerson?.id === myPersonId}
        onClaimProfile={handleClaimProfile}
      />

      {/* Kinship Finder Modal */}
      <KinshipFinderModal
        isOpen={isKinshipModalOpen}
        onClose={() => setIsKinshipModalOpen(false)}
        initialPersonA={kinshipInitialPerson}
        allPersons={currentPersons}
        allRelationships={currentRelationships}
      />

      {/* Edit Proposal Modal */}
      <EditProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        treeId={currentTreeInfo.id}
        members={currentPersons}
        proposals={proposals}
        onProposalUpdated={handleProposalUpdated}
        isAdmin={Boolean(currentUser)}
      />

      {/* Digital Archive Gallery Modal */}
      <DigitalArchiveGallery
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaFilterPersonId(null);
          setMediaUploadPersonId(null);
        }}
        mediaList={mediaAssets}
        clanName={currentTreeInfo.name}
        allPersons={currentPersons}
        initialFilterPersonId={mediaFilterPersonId}
        initialOpenUploadForPersonId={mediaUploadPersonId}
        onAddMedia={handleAddMedia}
        onUpdateMedia={handleUpdateMedia}
        onDeleteMedia={handleDeleteMedia}
        onSelectPersonInTree={(person) => {
          setActiveTab('tree');
          setSelectedPerson(person);
        }}
        onSetAsPersonAvatar={handleSetPersonAvatarFromMedia}
      />

      {/* Lunar Calendar Modal */}
      <LunarCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        events={clanEvents}
        clanName={currentTreeInfo.name}
      />

      {/* Tree Export & Print Modal */}
      <TreeExportModal
        treeId={currentTreeInfo.id}
        relationships={currentRelationships}
        onImport={handleExcelImport}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        clanName={currentTreeInfo.name}
        members={currentPersons}
        coupletText={currentTreeInfo.coupletText}
      />

      {/* Invite Member & RBAC Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        clanName={currentTreeInfo.name}
        members={currentPersons}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        allPersons={currentPersons}
        treeId={currentTreeInfo.id}
        initialRelativePerson={addMemberTargetPerson}
        onMemberAdded={handleMemberAdded}
      />

      {/* Global Connect Relationship Modal (Invoked from Member Profile Drawer) */}
      <ConnectRelationshipModal
        isOpen={isGlobalConnectModalOpen}
        onClose={() => {
          setIsGlobalConnectModalOpen(false);
          setConnectModalInitialPerson(null);
        }}
        allPersons={currentPersons}
        relationships={currentRelationships}
        initialPersonA={connectModalInitialPerson}
        onSaveRelationship={handleSaveRelationship}
        onDeleteRelationship={handleDeleteRelationship}
      />

      {/* Edit Member Profile & Avatar Modal */}
      <EditMemberModal
        isOpen={isEditMemberModalOpen}
        onClose={() => setIsEditMemberModalOpen(false)}
        person={personToEdit}
        onSave={handleMemberUpdated}
      />

      {/* Edit Clan Introduction Portal Modal */}
      <EditClanPortalModal
        isOpen={isEditPortalModalOpen}
        onClose={() => setIsEditPortalModalOpen(false)}
        treeInfo={currentTreeInfo}
        onSave={handleUpdateTreeInfo}
      />

      {/* Auth Modal (Login, Registration, Person Binding) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        allPersons={currentPersons}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Clan Workspace Modal (Multi-tenancy clan switcher, join by code, create clan) */}
      <ClanWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        currentTree={currentTreeInfo}
        availableTrees={availableTrees}
        onSelectTree={handleSelectTree}
        onCreateTree={handleCreateTree}
        onJoinByCode={handleJoinByCode}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-heritage-border py-8 text-xs text-heritage-inkMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-serif font-bold text-sm text-heritage-crimson">
              Gia Phả Việt – Kết Nối Cội Nguồn Dòng Tộc 4.0
            </div>
            <p>Kiến trúc Modular Monolith • Java 17 Spring Boot 3.x • PostgreSQL • React 19 Flow & ELK.js</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Spring Boot API 8080 Active
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> React Flow 5173 Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
