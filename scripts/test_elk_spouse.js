const ELK = require('D:/Project/giapha/frontend/node_modules/elkjs/lib/elk.bundled.js');
const elk = new ELK();

// Suppose we have Husband, Wife (Gen 1), Son1, Son2 (Gen 2), Grandson (Gen 3)
const CARD_WIDTH = 240;
const CARD_HEIGHT = 135;
const SPOUSE_SPACING = 40;

const persons = [
  { id: 'p1', name: 'Nguyễn Quý Công (Chồng)', gen: 1, spouses: ['p2'] },
  { id: 'p2', name: 'Lê Thị Diệu Thuần (Vợ)', gen: 1 },
  { id: 'p3', name: 'Nguyễn Trọng Phúc (Con trai 1)', gen: 2, spouses: [] },
  { id: 'p4', name: 'Nguyễn Trọng Thọ (Con trai 2)', gen: 2, spouses: [] },
  { id: 'p5', name: 'Nguyễn Văn Hòa (Cháu đích tôn)', gen: 3, spouses: [] }
];

const spousesByPrimary = {
  p1: ['p2']
};

const edges = [
  { id: 'e1', source: 'p1', target: 'p3' },
  { id: 'e2', source: 'p1', target: 'p4' },
  { id: 'e3', source: 'p3', target: 'p5' }
];

// Nodes passed to ELK: primary nodes, with reserved width for spouses
const elkChildren = persons
  .filter(p => p.id !== 'p2') // p2 is spouse of p1
  .map(p => {
    const spouseCount = (spousesByPrimary[p.id] || []).length;
    const reservedWidth = CARD_WIDTH + spouseCount * (CARD_WIDTH + SPOUSE_SPACING);
    return {
      id: p.id,
      width: reservedWidth,
      height: CARD_HEIGHT
    };
  });

const elkEdges = edges.map(e => ({
  id: e.id,
  sources: [e.source],
  targets: [e.target]
}));

const graph = {
  id: 'root',
  layoutOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.spacing.nodeNode': '60',
    'elk.layered.spacing.nodeNodeBetweenLayers': '90',
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    'elk.alignment': 'CENTER'
  },
  children: elkChildren,
  edges: elkEdges
};

elk.layout(graph).then(layouted => {
  console.log('ELK layout completed:');
  const finalPositions = {};
  layouted.children.forEach(c => {
    finalPositions[c.id] = { x: c.x, y: c.y, width: CARD_WIDTH, height: CARD_HEIGHT };
    const spouses = spousesByPrimary[c.id] || [];
    spouses.forEach((sId, idx) => {
      finalPositions[sId] = {
        x: c.x + (idx + 1) * (CARD_WIDTH + SPOUSE_SPACING),
        y: c.y, // EXACT SAME Y!
        width: CARD_WIDTH,
        height: CARD_HEIGHT
      };
    });
  });

  console.log(JSON.stringify(finalPositions, null, 2));
  
  // Verify equality of Y for husband & wife
  const husbandY = finalPositions['p1'].y;
  const wifeY = finalPositions['p2'].y;
  const sonY = finalPositions['p3'].y;
  console.log(`Husband Y = ${husbandY}, Wife Y = ${wifeY}, Son Y = ${sonY}`);
  if (husbandY === wifeY && sonY > wifeY) {
    console.log('SUCCESS: Husband & Wife on exact same line, Son clearly below!');
  } else {
    console.log('FAILURE');
  }
}).catch(console.error);
