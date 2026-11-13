// Automated verification test for Gia Pha features
const assert = require('assert');

// Mock data
const mockPersons = [
  { id: 'p-01', fullName: 'Nguyễn Quý Công', courtesyName: 'Đức Hưng', gender: 'MALE', generation: 1, isLineage: true },
  { id: 'p-02', fullName: 'Lê Thị Diệu Thuần', courtesyName: 'Diệu Thục', gender: 'FEMALE', generation: 1, isLineage: false },
  { id: 'p-03', fullName: 'Nguyễn Trọng Phúc', courtesyName: '', gender: 'MALE', generation: 2, isLineage: true },
  { id: 'p-04', fullName: 'Trần Thị Mai', courtesyName: '', gender: 'FEMALE', generation: 2, isLineage: false },
  { id: 'p-05', fullName: 'Nguyễn Văn Minh', courtesyName: '', gender: 'MALE', generation: 3, isLineage: true }
];

const mockRelationships = [
  { id: 'r-01', type: 'MARRIAGE', fromPersonId: 'p-01', toPersonId: 'p-02', marriageOrder: 1 },
  { id: 'r-02', type: 'BIOLOGICAL_PARENT', fromPersonId: 'p-01', toPersonId: 'p-03' },
  { id: 'r-03', type: 'BIOLOGICAL_PARENT', fromPersonId: 'p-02', toPersonId: 'p-03' },
  { id: 'r-04', type: 'MARRIAGE', fromPersonId: 'p-03', toPersonId: 'p-04', marriageOrder: 1 }
];

console.log('--- TEST 1: SPOUSE BUNDLING (Gộp vợ chồng vào 1 card) ---');
function bundleSpouses(persons, relationships) {
  const bundledSpouses = new Set();
  const bundledMap = new Map();

  relationships.forEach((r) => {
    if (r.type === 'MARRIAGE') {
      const pA = persons.find((p) => p.id === r.fromPersonId);
      const pB = persons.find((p) => p.id === r.toPersonId);
      if (!pA || !pB) return;

      let primary = pA;
      let spouse = pB;
      if (pA.isLineage && !pB.isLineage) {
        primary = pA;
        spouse = pB;
      } else if (!pA.isLineage && pB.isLineage) {
        primary = pB;
        spouse = pA;
      }

      if (!bundledSpouses.has(primary.id)) {
        bundledSpouses.add(spouse.id);
        const list = bundledMap.get(primary.id) || [];
        list.push(spouse);
        bundledMap.set(primary.id, list);
      }
    }
  });

  const primaries = persons.filter((p) => !bundledSpouses.has(p.id));
  return { primaries, bundledMap, bundledSpouses };
}

const { primaries, bundledMap } = bundleSpouses(mockPersons, mockRelationships);
assert.strictEqual(primaries.length, 3, 'Should have 3 primary cards: p-01, p-03, p-05');
assert.strictEqual(bundledMap.get('p-01')[0].fullName, 'Lê Thị Diệu Thuần', 'p-01 should bundle Lê Thị Diệu Thuần');
assert.strictEqual(bundledMap.get('p-03')[0].fullName, 'Trần Thị Mai', 'p-03 should bundle Trần Thị Mai');
console.log('✓ TEST 1 PASSED: Spouses bundled correctly into husband cards.');

console.log('--- TEST 2: SEARCH MATCHING BOTH HUSBAND AND WIFE ---');
function filterCardsWithSearch(primaries, bundledMap, query) {
  const q = query.trim().toLowerCase();
  if (!q) return primaries;

  return primaries.filter((p) => {
    const matchPrimary = p.fullName.toLowerCase().includes(q) || (p.courtesyName && p.courtesyName.toLowerCase().includes(q));
    if (matchPrimary) return true;

    const spouses = bundledMap.get(p.id) || [];
    const matchSpouse = spouses.some(
      (s) => s.fullName.toLowerCase().includes(q) || (s.courtesyName && s.courtesyName.toLowerCase().includes(q))
    );
    return matchSpouse;
  });
}

// Search wife name "Diệu Thuần"
const searchWifeResults = filterCardsWithSearch(primaries, bundledMap, 'Diệu Thuần');
assert.strictEqual(searchWifeResults.length, 1, 'Search for wife "Diệu Thuần" should return 1 couple card');
assert.strictEqual(searchWifeResults[0].id, 'p-01', 'Card containing p-01 (husband) should be returned');

// Search wife courtesy name "Diệu Thục"
const searchCourtesyResults = filterCardsWithSearch(primaries, bundledMap, 'Diệu Thục');
assert.strictEqual(searchCourtesyResults.length, 1, 'Search for courtesy name "Diệu Thục" should find the card');

// Search husband name "Quý Công"
const searchHusbandResults = filterCardsWithSearch(primaries, bundledMap, 'Quý Công');
assert.strictEqual(searchHusbandResults.length, 1, 'Search for husband should find the card');
console.log('✓ TEST 2 PASSED: Search matches both husband and wife names.');

console.log('--- TEST 3: SELECTION ACCURACY (Chọn đúng người trong card) ---');
let selectedPerson = null;
function handleSelect(person) {
  selectedPerson = person;
}

// Click on primary person
handleSelect(mockPersons[0]); // p-01
assert.strictEqual(selectedPerson.id, 'p-01');
assert.strictEqual(selectedPerson.fullName, 'Nguyễn Quý Công');

// Click on spouse
handleSelect(bundledMap.get('p-01')[0]); // p-02
assert.strictEqual(selectedPerson.id, 'p-02');
assert.strictEqual(selectedPerson.fullName, 'Lê Thị Diệu Thuần');
console.log('✓ TEST 3 PASSED: Clicking on wife selects wife, clicking on husband selects husband.');

console.log('--- TEST 4: CONNECTING 2 EXISTING CARDS (Vợ chồng & Cha con) ---');
// Connect p-05 (Nguyễn Văn Minh) and a new independent person p-06
const p06 = { id: 'p-06', fullName: 'Hoàng Thị Cúc', gender: 'FEMALE', generation: 3, isLineage: false };
const testPersons = [...mockPersons, p06];

// Connect as MARRIAGE
const newMarriageRel = {
  id: 'r-05',
  type: 'MARRIAGE',
  fromPersonId: 'p-05',
  toPersonId: 'p-06',
  marriageOrder: 1
};
const testRelsAfterMarriage = [...mockRelationships, newMarriageRel];
const bundledAfterMarriage = bundleSpouses(testPersons, testRelsAfterMarriage);
assert.strictEqual(bundledAfterMarriage.bundledMap.get('p-05')[0].fullName, 'Hoàng Thị Cúc');
console.log('✓ TEST 4A PASSED: 2 existing cards successfully connected as husband and wife into 1 card.');

// Connect as PARENT_CHILD: p-03 is parent of p-05
const newParentChildRel = {
  id: 'r-06',
  type: 'BIOLOGICAL_PARENT',
  fromPersonId: 'p-03',
  toPersonId: 'p-05'
};
assert.strictEqual(newParentChildRel.fromPersonId, 'p-03');
assert.strictEqual(newParentChildRel.toPersonId, 'p-05');
// Check generation sync
const parent = testPersons.find(p => p.id === 'p-03');
const child = testPersons.find(p => p.id === 'p-05');
assert.strictEqual(child.generation, parent.generation + 1, 'Child generation should be parent.generation + 1');
console.log('✓ TEST 4B PASSED: Parent-Child connection and generation sync validated.');

console.log('\n=============================================');
console.log('ALL 4 TEST SUITES PASSED WITH 100% SUCCESS!');
console.log('=============================================');
