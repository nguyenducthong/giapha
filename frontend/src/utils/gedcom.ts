import { Person, Relationship, Gender, LifeStatus } from '../types/genealogy';

/**
 * GEDCOM 5.5.1 Serializer & Parser for Vietnamese Genealogy System
 * Handles UTF-8 encoded genealogy data with traditional Vietnamese naming conventions.
 */

export function exportToGedcom(
  treeName: string,
  persons: Person[],
  relationships: Relationship[]
): string {
  const lines: string[] = [];

  // Header
  lines.push('0 HEAD');
  lines.push('1 SOUR GIAPHA_VIET');
  lines.push('2 VERS 4.0');
  lines.push('2 NAME Gia Phả Việt – Hệ Thống Quản Trị Phả Hệ 4.0');
  lines.push('1 DEST ANY');
  lines.push(`1 DATE ${new Date().toISOString().split('T')[0]}`);
  lines.push('1 SUBM @SUBM1@');
  lines.push('1 GEDC');
  lines.push('2 VERS 5.5.1');
  lines.push('2 FORM LINEAGE-LINKED');
  lines.push('1 CHAR UTF-8');

  // Submitter
  lines.push('0 @SUBM1@ SUBM');
  lines.push(`1 NAME Hội Đồng Gia Tộc ${treeName}`);

  // Map of individuals to Family IDs they belong to as children or spouses
  const personFamiliesAsChild: Record<string, string> = {};
  const marriages: { id: string; husbandId: string; wifeId: string; childrenIds: string[] }[] = [];

  // Process relationships to find unions
  const parentMap: Record<string, { fathers: string[]; mothers: string[] }> = {};
  relationships
    .filter((r) => r.type === 'BIOLOGICAL_PARENT')
    .forEach((r) => {
      if (!parentMap[r.toPersonId]) {
        parentMap[r.toPersonId] = { fathers: [], mothers: [] };
      }
      const parent = persons.find((p) => p.id === r.fromPersonId);
      if (parent) {
        if (parent.gender === 'FEMALE') {
          parentMap[r.toPersonId].mothers.push(parent.id);
        } else {
          parentMap[r.toPersonId].fathers.push(parent.id);
        }
      }
    });

  // Group into families
  let famCounter = 1;
  const famMap: Record<string, string> = {}; // key: fatherId_motherId -> famId

  Object.entries(parentMap).forEach(([childId, pInfo]) => {
    const fatherId = pInfo.fathers[0] || 'UNKNOWN_H';
    const motherId = pInfo.mothers[0] || 'UNKNOWN_W';
    const key = `${fatherId}_${motherId}`;

    if (!famMap[key]) {
      const famId = `@F${famCounter++}@`;
      famMap[key] = famId;
      marriages.push({
        id: famId,
        husbandId: fatherId.startsWith('UNKNOWN') ? '' : fatherId,
        wifeId: motherId.startsWith('UNKNOWN') ? '' : motherId,
        childrenIds: [childId],
      });
    } else {
      const m = marriages.find((m) => m.id === famMap[key]);
      if (m && !m.childrenIds.includes(childId)) {
        m.childrenIds.push(childId);
      }
    }
    personFamiliesAsChild[childId] = famMap[key];
  });

  // Write INDI (Individual) Records
  persons.forEach((p) => {
    const indiId = `@I${p.id.replace(/[^a-zA-Z0-9]/g, '')}@`;
    lines.push(`0 ${indiId} INDI`);

    // Split name into given and surname (Vietnamese: Họ + Tên đệm + Tên chính)
    const nameParts = p.fullName.trim().split(' ');
    const surname = nameParts[0] || '';
    const givenName = nameParts.slice(1).join(' ') || p.fullName;
    lines.push(`1 NAME ${givenName} /${surname}/`);
    lines.push(`2 GIVN ${givenName}`);
    lines.push(`2 SURN ${surname}`);

    if (p.courtesyName) {
      lines.push(`2 NICK ${p.courtesyName}`);
    }

    // Gender
    lines.push(`1 SEX ${p.gender === 'FEMALE' ? 'F' : 'M'}`);

    // Birth
    if (p.birthYear || p.birthPlace) {
      lines.push('1 BIRT');
      if (p.birthYear) lines.push(`2 DATE ${p.birthYear}`);
      if (p.birthPlace) lines.push(`2 PLAC ${p.birthPlace}`);
    }

    // Death
    if (p.status === 'DECEASED' || p.deathYear || p.lunarDeathDate) {
      lines.push('1 DEAT');
      if (p.deathYear) lines.push(`2 DATE ${p.deathYear}`);
      if (p.lunarDeathDate) lines.push(`2 NOTE Ngày giỗ âm lịch: ${p.lunarDeathDate}`);
    }

    // Burial / Tomb
    if (p.tombLocation) {
      lines.push('1 BURI');
      lines.push(`2 PLAC ${p.tombLocation}`);
    }

    // Branch and Generation notes
    lines.push(`1 NOTE Đời thứ ${p.generation} - ${p.branchName || 'Chi Trưởng'}`);
    if (p.biography) {
      lines.push(`1 NOTE Tiểu sử: ${p.biography}`);
    }

    // Link to Family as child
    if (personFamiliesAsChild[p.id]) {
      lines.push(`1 FAMC ${personFamiliesAsChild[p.id]}`);
    }
  });

  // Write FAM (Family) Records
  marriages.forEach((fam) => {
    lines.push(`0 ${fam.id} FAM`);
    if (fam.husbandId) {
      lines.push(`1 HUSB @I${fam.husbandId.replace(/[^a-zA-Z0-9]/g, '')}@`);
    }
    if (fam.wifeId) {
      lines.push(`1 WIFE @I${fam.wifeId.replace(/[^a-zA-Z0-9]/g, '')}@`);
    }
    fam.childrenIds.forEach((childId) => {
      lines.push(`1 CHIL @I${childId.replace(/[^a-zA-Z0-9]/g, '')}@`);
    });
  });

  // Trailer
  lines.push('0 TRLR');

  return lines.join('\n');
}

/**
 * Parses simple GEDCOM format into Person and Relationship items
 */
export function parseGedcom(gedcomText: string): { persons: Person[]; relationships: Relationship[] } {
  const lines = gedcomText.split(/\r?\n/);
  const parsedPersons: Person[] = [];
  const parsedRelationships: Relationship[] = [];

  let currentIndi: Partial<Person> | null = null;
  let currentIndiTag = '';
  let famMap: Record<string, { husbandId?: string; wifeId?: string; childrenIds: string[] }> = {};
  let currentFamId = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(' ');
    const level = parts[0];
    const tagOrId = parts[1];
    const value = parts.slice(2).join(' ');

    if (level === '0') {
      // Save previous indi if exists
      if (currentIndi && currentIndi.fullName) {
        parsedPersons.push(finalizePerson(currentIndi));
        currentIndi = null;
      }

      if (value === 'INDI') {
        currentIndiTag = tagOrId;
        currentIndi = {
          id: tagOrId.replace(/@/g, ''),
          generation: 1,
          branchName: 'Chi Nhập Từ GEDCOM',
          status: 'LIVING',
          isLineage: true,
        };
      } else if (value === 'FAM') {
        currentFamId = tagOrId;
        famMap[currentFamId] = { childrenIds: [] };
      }
    } else if (currentIndi) {
      if (tagOrId === 'NAME') {
        // e.g. "Quý Công /Nguyễn/" -> "Nguyễn Quý Công"
        const match = value.match(/(.*?)\s*\/(.*?)\//);
        if (match) {
          const surname = match[2].trim();
          const given = match[1].trim();
          currentIndi.fullName = `${surname} ${given}`.trim();
        } else {
          currentIndi.fullName = value.replace(/\//g, '').trim();
        }
      } else if (tagOrId === 'SEX') {
        currentIndi.gender = value.toUpperCase() === 'F' ? 'FEMALE' : 'MALE';
      } else if (tagOrId === 'DATE' && lines[i - 1]?.includes('BIRT')) {
        const year = parseInt(value.replace(/[^0-9]/g, ''));
        if (!isNaN(year)) currentIndi.birthYear = year;
      } else if (tagOrId === 'DATE' && lines[i - 1]?.includes('DEAT')) {
        const year = parseInt(value.replace(/[^0-9]/g, ''));
        if (!isNaN(year)) {
          currentIndi.deathYear = year;
          currentIndi.status = 'DECEASED';
        }
      } else if (tagOrId === 'PLAC' && lines[i - 1]?.includes('BURI')) {
        currentIndi.tombLocation = value;
      }
    } else if (currentFamId && famMap[currentFamId]) {
      if (tagOrId === 'HUSB') famMap[currentFamId].husbandId = value.replace(/@/g, '');
      if (tagOrId === 'WIFE') famMap[currentFamId].wifeId = value.replace(/@/g, '');
      if (tagOrId === 'CHIL') famMap[currentFamId].childrenIds.push(value.replace(/@/g, ''));
    }
  }

  // Push last indi
  if (currentIndi && currentIndi.fullName) {
    parsedPersons.push(finalizePerson(currentIndi));
  }

  // Generate relationships from FAM map
  let relIndex = 1;
  Object.values(famMap).forEach((fam) => {
    const parents = [fam.husbandId, fam.wifeId].filter(Boolean);
    fam.childrenIds.forEach((childId) => {
      parents.forEach((parentId) => {
        parsedRelationships.push({
          id: `rel-ged-${relIndex++}`,
          treeId: 'imported-tree',
          type: 'BIOLOGICAL_PARENT',
          fromPersonId: parentId!,
          toPersonId: childId,
        });
      });
    });
  });

  return { persons: parsedPersons, relationships: parsedRelationships };
}

function finalizePerson(p: Partial<Person>): Person {
  return {
    id: p.id || `p-ged-${Math.random().toString(36).substring(2, 9)}`,
    treeId: 'imported-tree',
    fullName: p.fullName || 'Thành Viên',
    courtesyName: p.courtesyName,
    gender: (p.gender as Gender) || 'MALE',
    generation: p.generation || 1,
    branchName: p.branchName || 'Chi Nhập Tự Động',
    birthYear: p.birthYear,
    deathYear: p.deathYear,
    status: (p.status as LifeStatus) || (p.deathYear ? 'DECEASED' : 'LIVING'),
    isLineage: p.isLineage !== undefined ? p.isLineage : true,
    tombLocation: p.tombLocation,
  };
}
