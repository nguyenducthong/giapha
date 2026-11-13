import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  ReactFlowInstance,
} from '@xyflow/react';
import { Person, Relationship } from '../../types/genealogy';
import { PersonNode } from './PersonNode';
import { getLayoutedElements } from '../../utils/elkLayout';
import {
  Search,
  Filter,
  Layers,
  Compass,
  Sparkles,
  Users2,
  UserCheck,
  Link2,
} from 'lucide-react';
import { Connection } from '@xyflow/react';
import { ConnectRelationshipModal } from './ConnectRelationshipModal';

const nodeTypes = {
  personNode: PersonNode,
};

interface GenealogyTreeCanvasProps {
  persons: Person[];
  relationships: Relationship[];
  onSelectPerson: (person: Person) => void;
  selectedPerson: Person | null;
  onOpenKinshipFinder: (person: Person) => void;
  onOpenConnectModal?: (person: Person | null) => void;
  onSaveRelationship: (newRel: Relationship, updatedPersons?: Person[]) => void;
  onDeleteRelationship: (relationshipId: string) => void;
  myPersonId?: string | null;
}

export const GenealogyTreeCanvas: React.FC<GenealogyTreeCanvasProps> = ({
  persons,
  relationships,
  onSelectPerson,
  selectedPerson,
  onOpenKinshipFinder,
  onOpenConnectModal,
  onSaveRelationship,
  onDeleteRelationship,
  myPersonId,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [maxGenerationFilter, setMaxGenerationFilter] = useState<number>(6);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');
  const [groupSpouses, setGroupSpouses] = useState<boolean>(true);
  const [isLayouting, setIsLayouting] = useState<boolean>(false);
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Handle Drag & Drop edge connection between 2 cards directly in canvas
  const handleConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && params.source !== params.target) {
        const pA = persons.find((p) => p.id === params.source);
        if (pA && onOpenConnectModal) {
          onOpenConnectModal(pA);
        }
      }
    },
    [persons, onOpenConnectModal]
  );

  // Map each person to their spouses from relationships
  const spouseMap = useMemo(() => {
    const map = new Map<string, Person[]>();
    persons.forEach((p) => map.set(p.id, []));

    relationships.forEach((r) => {
      if (r.type === 'MARRIAGE') {
        const p1 = persons.find((p) => p.id === r.fromPersonId);
        const p2 = persons.find((p) => p.id === r.toPersonId);
        if (p1 && p2) {
          const list1 = map.get(p1.id) || [];
          if (!list1.some((s) => s.id === p2.id)) list1.push(p2);
          map.set(p1.id, list1);

          const list2 = map.get(p2.id) || [];
          if (!list2.some((s) => s.id === p1.id)) list2.push(p1);
          map.set(p2.id, list2);
        }
      }
    });

    return map;
  }, [persons, relationships]);

  // Determine primary persons and spouse mappings
  const { primaryPersons, bundledSpouseMap, spouseToPrimaryMap } = useMemo(() => {
    const bundledSpouses = new Set<string>();
    const bundledMap = new Map<string, Person[]>();
    const toPrimary = new Map<string, string>();

    relationships.forEach((r) => {
      if (r.type === 'MARRIAGE') {
        const pA = persons.find((p) => p.id === r.fromPersonId);
        const pB = persons.find((p) => p.id === r.toPersonId);
        if (!pA || !pB) return;

        // Determine who is primary:
        // 1. Lineage member (con họ) beats non-lineage (dâu/rể)
        // 2. Male beats female in traditional display, or pA if same
        let primary = pA;
        let spouse = pB;

        if (pA.isLineage && !pB.isLineage) {
          primary = pA;
          spouse = pB;
        } else if (!pA.isLineage && pB.isLineage) {
          primary = pB;
          spouse = pA;
        } else if (pA.gender === 'FEMALE' && pB.gender === 'MALE') {
          primary = pB;
          spouse = pA;
        }

        // If primary itself hasn't been bundled, bundle spouse into primary
        if (!bundledSpouses.has(primary.id)) {
          bundledSpouses.add(spouse.id);
          toPrimary.set(spouse.id, primary.id);

          const existingList = bundledMap.get(primary.id) || [];
          if (!existingList.some((s) => s.id === spouse.id)) {
            existingList.push(spouse);
          }
          bundledMap.set(primary.id, existingList);
        }
      }
    });

    const primaries = groupSpouses
      ? persons.filter((p) => !bundledSpouses.has(p.id))
      : persons;

    return {
      primaryPersons: primaries,
      bundledSpouseMap: bundledMap,
      spouseToPrimaryMap: toPrimary,
    };
  }, [persons, relationships, groupSpouses]);

  // Filter persons with robust search that checks BOTH husband and wife
  const filteredPrimaryPersons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return primaryPersons.filter((p) => {
      const matchBranch = selectedBranch === 'ALL' || p.branchName.includes(selectedBranch);
      const matchGen = p.generation <= maxGenerationFilter;

      if (!matchBranch || !matchGen) return false;
      if (!q) return true;

      // Check primary person
      const matchPrimary =
        p.fullName.toLowerCase().includes(q) ||
        (p.courtesyName && p.courtesyName.toLowerCase().includes(q));

      if (matchPrimary) return true;

      // Check bundled spouses in the same card!
      const spouses = bundledSpouseMap.get(p.id) || spouseMap.get(p.id) || [];
      const matchSpouse = spouses.some(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          (s.courtesyName && s.courtesyName.toLowerCase().includes(q))
      );

      return matchSpouse;
    });
  }, [
    primaryPersons,
    selectedBranch,
    maxGenerationFilter,
    searchQuery,
    bundledSpouseMap,
    spouseMap,
  ]);

  // Construct nodes and edges for React Flow
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = filteredPrimaryPersons.map((p) => {
      const spouses = groupSpouses
        ? bundledSpouseMap.get(p.id) || []
        : [];

      return {
        id: p.id,
        type: 'personNode',
        data: {
          person: p,
          spouses,
          activePersonId: selectedPerson?.id,
          searchQuery,
          myPersonId,
          groupSpouses,
          onSelect: onSelectPerson,
        },
        position: { x: 0, y: 0 },
        width: groupSpouses && spouses.length > 0 ? 275 : 240,
        height: groupSpouses && spouses.length > 0 ? 190 : 135,
      };
    });

    const validNodeIds = new Set(filteredPrimaryPersons.map((p) => p.id));
    const edges: Edge[] = [];
    const createdEdgeKeys = new Set<string>();

    relationships.forEach((r) => {
      if (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') {
        // If parent is a bundled spouse, redirect edge to the primary node!
        const effectiveParentId =
          groupSpouses && spouseToPrimaryMap.has(r.fromPersonId)
            ? spouseToPrimaryMap.get(r.fromPersonId)!
            : r.fromPersonId;

        const effectiveChildId = r.toPersonId;

        if (validNodeIds.has(effectiveParentId) && validNodeIds.has(effectiveChildId)) {
          const edgeKey = `${effectiveParentId}->${effectiveChildId}`;
          if (!createdEdgeKeys.has(edgeKey)) {
            createdEdgeKeys.add(edgeKey);
            edges.push({
              id: `edge-${edgeKey}`,
              source: effectiveParentId,
              sourceHandle: 'bottom',
              target: effectiveChildId,
              targetHandle: 'top',
              type: 'smoothstep',
              animated:
                effectiveParentId === selectedPerson?.id ||
                r.fromPersonId === selectedPerson?.id,
              style: {
                stroke: '#8B2E2E',
                strokeWidth: 2,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#8B2E2E',
                width: 12,
                height: 12,
              },
            });
          }
        }
      } else if (r.type === 'MARRIAGE' && !groupSpouses) {
        // Draw separate horizontal dashed marriage edges only when groupSpouses is false
        if (validNodeIds.has(r.fromPersonId) && validNodeIds.has(r.toPersonId)) {
          // Identify primary (husband/lineage) as source on left, spouse on right
          const isFromPrimary = spouseToPrimaryMap.get(r.toPersonId) === r.fromPersonId;
          const srcId = isFromPrimary ? r.fromPersonId : r.toPersonId;
          const tgtId = isFromPrimary ? r.toPersonId : r.fromPersonId;

          edges.push({
            id: r.id,
            source: srcId,
            sourceHandle: 'right',
            target: tgtId,
            targetHandle: 'left',
            type: 'straight',
            style: {
              stroke: '#C49A45',
              strokeWidth: 2.5,
              strokeDasharray: '4 4',
            },
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    filteredPrimaryPersons,
    relationships,
    selectedPerson,
    searchQuery,
    myPersonId,
    groupSpouses,
    bundledSpouseMap,
    spouseToPrimaryMap,
    onSelectPerson,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Run ELK layout
  const applyLayout = useCallback(async () => {
    setIsLayouting(true);
    const isCouple = groupSpouses;

    // Build spouseMap for side-by-side layout when in separated mode
    const layoutSpouseMap = new Map<string, string[]>();
    if (!groupSpouses) {
      const validNodeIds = new Set(initialNodes.map((n) => n.id));
      bundledSpouseMap.forEach((spouses, primaryId) => {
        if (validNodeIds.has(primaryId)) {
          const validSpouseIds = spouses
            .map((s) => s.id)
            .filter((id) => validNodeIds.has(id));
          if (validSpouseIds.length > 0) {
            layoutSpouseMap.set(primaryId, validSpouseIds);
          }
        }
      });
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(
      initialNodes,
      initialEdges,
      {
        direction,
        nodeWidth: isCouple ? 275 : 240,
        nodeHeight: isCouple ? 190 : 135,
        nodeSpacing: isCouple ? 70 : 60,
        layerSpacing: isCouple ? 100 : 90,
        spouseMap: layoutSpouseMap,
        spouseSpacing: 40,
      }
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setIsLayouting(false);

    // Auto-fit tree nicely in viewport after layout calculation
    setTimeout(() => {
      reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 400 });
    }, 60);
  }, [initialNodes, initialEdges, direction, groupSpouses, bundledSpouseMap, setNodes, setEdges]);

  useEffect(() => {
    applyLayout();
  }, [applyLayout]);

  return (
    <div className="relative w-full h-[720px] rounded-2xl border-2 border-heritage-border bg-[#FBF9F5] shadow-heritage-md overflow-hidden flex flex-col">
      {/* Top Filter and Toolbar */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-b border-heritage-border flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Search */}
        <div className="relative w-64 sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-heritage-inkMuted" />
          <input
            type="text"
            placeholder="Tìm tên cụ ông, cụ bà, dâu rể..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-heritage-border bg-heritage-parchment/40 text-heritage-ink placeholder:text-heritage-inkMuted focus:outline-none focus:ring-2 focus:ring-heritage-crimson font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              ×
            </button>
          )}
        </div>

        {/* Filters & Options */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Branch filter */}
          <div className="flex items-center gap-1.5 bg-heritage-parchment/60 px-2.5 py-1.5 rounded-lg border border-heritage-border">
            <Filter className="w-3.5 h-3.5 text-heritage-moss" />
            <span className="font-semibold text-heritage-ink">Chi phái:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent font-medium text-heritage-ink focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toàn thể dòng tộc</option>
              <option value="Trưởng">Chi Trưởng (Ngành 1)</option>
              <option value="Chi Hai">Chi Hai (Ngành 2)</option>
            </select>
          </div>

          {/* Generation filter */}
          <div className="flex items-center gap-1.5 bg-heritage-parchment/60 px-2.5 py-1.5 rounded-lg border border-heritage-border">
            <Layers className="w-3.5 h-3.5 text-heritage-gold" />
            <span className="font-semibold text-heritage-ink">Đời:</span>
            <select
              value={maxGenerationFilter}
              onChange={(e) => setMaxGenerationFilter(Number(e.target.value))}
              className="bg-transparent font-medium text-heritage-ink focus:outline-none cursor-pointer"
            >
              <option value={2}>Đời 1 – 2 (Tiên Tổ)</option>
              <option value={4}>Đời 1 – 4 (Trung Đại)</option>
              <option value={6}>Đời 1 – 6 (Toàn Bộ)</option>
            </select>
          </div>

          {/* Toggle Spouse Grouping into 1 Card */}
          <button
            onClick={() => setGroupSpouses(!groupSpouses)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              groupSpouses
                ? 'bg-gradient-to-r from-amber-600 to-[#8B2E2E] text-white border-amber-500 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            title="Bật/Tắt chế độ gộp vợ chồng vào chung 1 card để phả đồ gọn gàng, không bị rối"
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>{groupSpouses ? 'Gộp Vợ Chồng (1 Card)' : 'Tách Rời Từng Card'}</span>
          </button>

          {/* Connect Relationship Button */}
          <button
            onClick={() => {
              if (onOpenConnectModal) {
                onOpenConnectModal(selectedPerson || persons[0] || null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-stone-900 to-[#8B2E2E] hover:brightness-110 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#E5C378]/30"
            title="Nối 2 thành viên hiện có thành vợ chồng hoặc cha mẹ - con cái"
          >
            <Link2 className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Nối Quan Hệ</span>
          </button>

          {/* Quick Kinship button */}
          <button
            onClick={() => onOpenKinshipFinder(selectedPerson || persons[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-heritage-moss hover:bg-heritage-mossLight text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tra Xưng Hô</span>
          </button>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirection((d) => (d === 'TB' ? 'LR' : 'TB'))}
            className="px-2.5 py-1.5 rounded-lg border border-heritage-border bg-white text-xs font-semibold text-heritage-ink hover:bg-heritage-parchment transition-colors"
            title="Đổi hướng hiển thị dọc (trên xuống) hoặc ngang (trái qua)"
          >
            {direction === 'TB' ? 'Bố cục Dọc' : 'Bố cục Ngang'}
          </button>
          <button
            onClick={() => setShowMiniMap((m) => !m)}
            className={`px-2.5 py-1.5 rounded-lg border border-heritage-border text-xs font-semibold transition-colors ${
              showMiniMap ? 'bg-heritage-gold text-white' : 'bg-white text-heritage-ink hover:bg-heritage-parchment'
            }`}
          >
            Bản đồ nhỏ
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLayouting && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-heritage-crimson text-white text-xs font-medium rounded-full shadow-md flex items-center gap-2 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-heritage-goldLight" />
          Đang dàn trang cây phả hệ với thuật toán ELK...
        </div>
      )}

      {/* Selected Person Indicator Banner if active */}
      {selectedPerson && (
        <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 z-10">
          <div className="flex items-center gap-2 truncate">
            <UserCheck className="w-4 h-4 text-heritage-crimson shrink-0" />
            <span className="truncate">
              Đang chọn xem thông tin:{' '}
              <strong className="text-heritage-crimson font-serif text-sm">
                {selectedPerson.fullName}
              </strong>{' '}
              (Đời thứ {selectedPerson.generation} • {selectedPerson.orderInFamily || selectedPerson.branchName})
            </span>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Hồ sơ hiển thị chi tiết ở bảng bên phải →
          </span>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            reactFlowInstanceRef.current = instance;
            instance.fitView({ padding: 0.15, duration: 300 });
          }}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="#C49A45" gap={24} size={1} className="opacity-15" />
          <Controls className="!bg-white !border !border-heritage-border !rounded-lg !shadow-md" />
          {showMiniMap && (
            <MiniMap
              nodeStrokeColor="#C49A45"
              nodeColor="#F8F4E9"
              nodeBorderRadius={4}
              maskColor="rgba(37, 43, 40, 0.08)"
            />
          )}
        </ReactFlow>
      </div>

      {/* Canvas Footnote Legend */}
      <div className="px-4 py-2 bg-white/90 border-t border-heritage-border text-[11px] text-heritage-inkMuted flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-heritage-gold border border-white"></span>
            Tiên Tổ / Thủy Tổ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-heritage-crimson"></span>
            Huyết thống Cha Mẹ ➔ Con
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-heritage-crimson font-bold">♥</span>
            {groupSpouses ? 'Vợ Chồng trong cùng 1 Card' : 'Hôn phối nối ngang'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Còn sống
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-heritage-gold text-[7px] text-white flex items-center justify-center font-bold">★</span>
            Đã mất (kèm ngày giỗ âm lịch)
          </span>
        </div>
        <div className="font-semibold text-heritage-crimson">
          {groupSpouses ? (
            <span>
              {filteredPrimaryPersons.length} thẻ gia đình ({persons.length} thành viên)
            </span>
          ) : (
            <span>Hiển thị: {filteredPrimaryPersons.length} / {persons.length} thành viên</span>
          )}
        </div>
      </div>
    </div>
  );
};
