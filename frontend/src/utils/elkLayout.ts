import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';

const elk = new ELK();

export interface ElkLayoutOptions {
  direction?: 'TB' | 'LR';
  nodeWidth?: number;
  nodeHeight?: number;
  nodeSpacing?: number;
  layerSpacing?: number;
  // Map of primary person id -> array of spouse ids (who should sit side-by-side on the exact same row)
  spouseMap?: Map<string, string[]>;
  spouseSpacing?: number;
}

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  options: ElkLayoutOptions = {}
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const {
    direction = 'TB',
    nodeWidth = 250,
    nodeHeight = 135,
    nodeSpacing = 60,
    layerSpacing = 90,
    spouseMap,
    spouseSpacing = 40,
  } = options;

  const isHorizontal = direction === 'LR';

  // Identify all spouse IDs that should be positioned side-by-side with their primary partner
  const allSpouseIds = new Set<string>();
  const spouseToPrimary = new Map<string, { primaryId: string; index: number }>();

  if (spouseMap && spouseMap.size > 0) {
    spouseMap.forEach((spouseIds, primaryId) => {
      spouseIds.forEach((sId, idx) => {
        allSpouseIds.add(sId);
        spouseToPrimary.set(sId, { primaryId, index: idx });
      });
    });
  }

  // Filter nodes for ELK: only layout primary nodes & non-spouses, but expand primary node width
  // to reserve exact horizontal room for its side-by-side spouse(s).
  const elkNodes = nodes
    .filter((node) => !allSpouseIds.has(node.id))
    .map((node) => {
      const spouseCount = spouseMap?.get(node.id)?.length || 0;
      const baseW = (node as any).width || (node.data as any)?.width || nodeWidth;
      const baseH = (node as any).height || (node.data as any)?.height || nodeHeight;

      const reservedWidth = isHorizontal
        ? baseW
        : baseW + spouseCount * (nodeWidth + spouseSpacing);
      const reservedHeight = isHorizontal
        ? baseH + spouseCount * (nodeHeight + spouseSpacing)
        : baseH;

      return {
        id: node.id,
        width: reservedWidth,
        height: reservedHeight,
      };
    });

  // Filter edges for ELK: exclude marriage edges to spouses so ELK doesn't treat marriage as downward parent-child hierarchy
  const elkEdges = edges
    .filter((edge) => !allSpouseIds.has(edge.target) && !allSpouseIds.has(edge.source))
    .map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': isHorizontal ? 'RIGHT' : 'DOWN',
      'elk.spacing.nodeNode': String(nodeSpacing),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.alignment': 'CENTER',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
    },
    children: elkNodes,
    edges: elkEdges,
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    const primaryElkMap = new Map<string, { x: number; y: number }>();

    layoutedGraph.children?.forEach((elkNode) => {
      primaryElkMap.set(elkNode.id, { x: elkNode.x ?? 0, y: elkNode.y ?? 0 });
    });

    const layoutedNodes = nodes.map((node) => {
      if (allSpouseIds.has(node.id)) {
        // This is a spouse: position horizontally side-by-side with primary at the EXACT same Y
        const spouseInfo = spouseToPrimary.get(node.id);
        if (spouseInfo && primaryElkMap.has(spouseInfo.primaryId)) {
          const primaryPos = primaryElkMap.get(spouseInfo.primaryId)!;
          const offset = (spouseInfo.index + 1) * (nodeWidth + spouseSpacing);
          return {
            ...node,
            position: {
              x: isHorizontal ? primaryPos.x : primaryPos.x + offset,
              y: isHorizontal ? primaryPos.y + offset : primaryPos.y, // EXACT SAME LEVEL / GENERATION!
            },
          };
        }
      }

      // Standard node or primary node
      const elkPos = primaryElkMap.get(node.id);
      return {
        ...node,
        position: {
          x: elkPos?.x ?? 0,
          y: elkPos?.y ?? 0,
        },
      };
    });

    return {
      nodes: layoutedNodes,
      edges,
    };
  } catch (error) {
    console.error('Lỗi khi tính toán ELK Layout:', error);
    // Fallback: nếu lỗi thì xếp tầng theo generation đơn giản
    const fallbackNodes = nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 4) * 280,
        y: Math.floor(index / 4) * 180,
      },
    }));
    return { nodes: fallbackNodes, edges };
  }
};
