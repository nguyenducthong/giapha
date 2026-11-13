import { Person, Relationship } from '../types/genealogy';

export interface KinshipResult {
  personA: Person;
  personB: Person;
  addressTermAtoB: string; // A gọi B là gì
  addressTermBtoA: string; // B gọi A là gì
  relationshipType: 'DIRECT_LINEAGE' | 'SIBLING' | 'COUSIN' | 'SPOUSE' | 'IN_LAW' | 'UNKNOWN';
  generationDifference: number; // genB - genA
  lowestCommonAncestor?: Person;
  pathDescription: string;
  pathPersons: Person[];
}

export function calculateKinship(
  personAId: string,
  personBId: string,
  persons: Person[],
  relationships: Relationship[]
): KinshipResult | null {
  const personA = persons.find(p => p.id === personAId);
  const personB = persons.find(p => p.id === personBId);

  if (!personA || !personB) return null;

  if (personAId === personBId) {
    return {
      personA,
      personB,
      addressTermAtoB: 'Chính mình',
      addressTermBtoA: 'Chính mình',
      relationshipType: 'DIRECT_LINEAGE',
      generationDifference: 0,
      pathDescription: 'Cùng một thành viên trong gia phả',
      pathPersons: [personA],
    };
  }

  // 1. Kiểm tra quan hệ Hôn phối (Vợ / Chồng)
  const spouseRel = relationships.find(
    r => r.type === 'MARRIAGE' &&
    ((r.fromPersonId === personAId && r.toPersonId === personBId) ||
     (r.fromPersonId === personBId && r.toPersonId === personAId))
  );

  if (spouseRel) {
    const isAHusband = personA.gender === 'MALE';
    return {
      personA,
      personB,
      addressTermAtoB: isAHusband ? 'Vợ' : 'Chồng',
      addressTermBtoA: isAHusband ? 'Chồng' : 'Vợ',
      relationshipType: 'SPOUSE',
      generationDifference: 0,
      pathDescription: `${personA.fullName} và ${personB.fullName} là vợ chồng kết tóc (${spouseRel.marriageOrder === 1 ? 'Chính thất' : 'Kế thất'})`,
      pathPersons: [personA, personB],
    };
  }

  // 2. Tìm danh sách Cha Mẹ trực hệ
  const getParents = (personId: string): Person[] => {
    const parentRels = relationships.filter(
      r => r.type === 'BIOLOGICAL_PARENT' && r.toPersonId === personId
    );
    return parentRels
      .map(r => persons.find(p => p.id === r.fromPersonId))
      .filter((p): p is Person => Boolean(p));
  };

  const parentsA = getParents(personAId);
  const parentsB = getParents(personBId);

  // 3. Kiểm tra quan hệ Cha/Mẹ - Con trực hệ
  if (parentsB.some(p => p.id === personAId)) {
    // A là cha/mẹ của B
    const termAtoB = personB.gender === 'MALE' ? 'Con trai' : 'Con gái';
    const termBtoA = personA.gender === 'MALE' ? 'Bố (Cha)' : 'Mẹ';
    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: termBtoA,
      relationshipType: 'DIRECT_LINEAGE',
      generationDifference: 1,
      pathDescription: `${personA.fullName} là bậc sinh thành của ${personB.fullName}`,
      pathPersons: [personA, personB],
    };
  }

  if (parentsA.some(p => p.id === personBId)) {
    // B là cha/mẹ của A
    const termAtoB = personB.gender === 'MALE' ? 'Bố (Cha)' : 'Mẹ';
    const termBtoA = personA.gender === 'MALE' ? 'Con trai' : 'Con gái';
    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: termBtoA,
      relationshipType: 'DIRECT_LINEAGE',
      generationDifference: -1,
      pathDescription: `${personB.fullName} là bậc sinh thành của ${personA.fullName}`,
      pathPersons: [personB, personA],
    };
  }

  // 4. Kiểm tra Anh / Chị / Em ruột (Cùng cha hoặc cùng mẹ)
  const commonParents = parentsA.filter(pA => parentsB.some(pB => pB.id === pA.id));
  if (commonParents.length > 0) {
    const isBOlder = (personB.birthYear ?? 0) < (personA.birthYear ?? 0);
    const termAtoB = isBOlder 
      ? (personB.gender === 'MALE' ? 'Anh trai' : 'Chị gái')
      : (personB.gender === 'MALE' ? 'Em trai' : 'Em gái');
    const termBtoA = isBOlder
      ? (personA.gender === 'MALE' ? 'Em trai' : 'Em gái')
      : (personA.gender === 'MALE' ? 'Anh trai' : 'Chị gái');

    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: termBtoA,
      relationshipType: 'SIBLING',
      generationDifference: 0,
      lowestCommonAncestor: commonParents[0],
      pathDescription: `Cùng chung cha mẹ (${commonParents.map(p => p.fullName).join(', ')}). ${isBOlder ? personB.fullName + ' lớn tuổi hơn' : personA.fullName + ' lớn tuổi hơn'}.`,
      pathPersons: [personA, commonParents[0], personB],
    };
  }

  // 5. Tính toán theo Thế Hệ và Nhánh Dòng Tộc (Thế thứ tiếng Việt)
  const genDiff = personB.generation - personA.generation;

  // A và B cùng thế hệ (Anh em họ chú bác)
  if (genDiff === 0) {
    const isBOlder = (personB.birthYear ?? 0) <= (personA.birthYear ?? 0);
    const isBMainBranch = personB.branchName.includes('Trưởng');
    const isAMainBranch = personA.branchName.includes('Trưởng');

    let termAtoB = '';
    let termBtoA = '';

    // Theo tục lệ Việt: "Bé bằng hạt kê, hễ vế bác vẫn là anh"
    if (isBMainBranch && !isAMainBranch) {
      termAtoB = personB.gender === 'MALE' ? 'Anh họ (Ngành trưởng)' : 'Chị họ (Ngành trưởng)';
      termBtoA = 'Em họ (Ngành thứ)';
    } else if (isAMainBranch && !isBMainBranch) {
      termAtoB = 'Em họ (Ngành thứ)';
      termBtoA = personA.gender === 'MALE' ? 'Anh họ (Ngành trưởng)' : 'Chị họ (Ngành trưởng)';
    } else {
      termAtoB = isBOlder 
        ? (personB.gender === 'MALE' ? 'Anh họ' : 'Chị họ')
        : (personB.gender === 'MALE' ? 'Em họ' : 'Em họ');
      termBtoA = isBOlder ? 'Em họ' : (personA.gender === 'MALE' ? 'Anh họ' : 'Chị họ');
    }

    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: termBtoA,
      relationshipType: 'COUSIN',
      generationDifference: 0,
      pathDescription: `Cùng thuộc Đời thứ ${personA.generation} trong dòng họ. Phân định thứ bậc theo chi cành (${personA.branchName} và ${personB.branchName}).`,
      pathPersons: [personA, personB],
    };
  }

  // B là bậc Cha/Chú/Bác (genDiff = -1)
  if (genDiff === -1) {
    const isBMainBranch = personB.branchName.includes('Trưởng');
    let termAtoB = '';
    if (personB.gender === 'MALE') {
      termAtoB = isBMainBranch ? 'Bác họ (Bậc trưởng)' : 'Chú họ';
    } else {
      termAtoB = 'Cô / O họ';
    }

    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: 'Cháu họ',
      relationshipType: 'COUSIN',
      generationDifference: -1,
      pathDescription: `${personB.fullName} thuộc Đời thứ ${personB.generation}, ${personA.fullName} thuộc Đời thứ ${personA.generation}. Thuộc bậc chú bác trong họ.`,
      pathPersons: [personA, personB],
    };
  }

  // B là bậc Con/Cháu (genDiff = 1)
  if (genDiff === 1) {
    const isAMainBranch = personA.branchName.includes('Trưởng');
    let termBtoA = '';
    if (personA.gender === 'MALE') {
      termBtoA = isAMainBranch ? 'Bác họ' : 'Chú họ';
    } else {
      termBtoA = 'Cô họ';
    }

    return {
      personA,
      personB,
      addressTermAtoB: 'Cháu họ',
      addressTermBtoA: termBtoA,
      relationshipType: 'COUSIN',
      generationDifference: 1,
      pathDescription: `${personA.fullName} là bậc chú bác (Đời ${personA.generation}) của ${personB.fullName} (Đời ${personB.generation}).`,
      pathPersons: [personA, personB],
    };
  }

  // B là bậc Ông/Bà (genDiff = -2)
  if (genDiff <= -2) {
    const absDiff = Math.abs(genDiff);
    let termAtoB = '';
    if (absDiff === 2) {
      termAtoB = personB.gender === 'MALE' ? 'Ông họ (Bậc ông)' : 'Bà họ';
    } else if (absDiff === 3) {
      termAtoB = personB.gender === 'MALE' ? 'Cụ ông' : 'Cụ bà';
    } else {
      termAtoB = personB.gender === 'MALE' ? 'Bậc Tiên Tổ' : 'Bậc Tiên Tổ';
    }

    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: 'Cháu chắt nội tộc',
      relationshipType: 'DIRECT_LINEAGE',
      generationDifference: genDiff,
      pathDescription: `${personB.fullName} là bậc tiền bối (Đời thứ ${personB.generation}), cách ${personA.fullName} (Đời thứ ${personA.generation}) ${absDiff} thế hệ.`,
      pathPersons: [personA, personB],
    };
  }

  // B là bậc Cháu/Chắt (genDiff >= 2)
  if (genDiff >= 2) {
    const termAtoB = genDiff === 2 ? 'Cháu nội tộc' : 'Chắt nội tộc';
    const termBtoA = personA.gender === 'MALE' ? 'Ông họ' : 'Bà họ';

    return {
      personA,
      personB,
      addressTermAtoB: termAtoB,
      addressTermBtoA: termBtoA,
      relationshipType: 'DIRECT_LINEAGE',
      generationDifference: genDiff,
      pathDescription: `${personA.fullName} là bậc ông bà (Đời ${personA.generation}) đối với ${personB.fullName} (Đời ${personB.generation}).`,
      pathPersons: [personA, personB],
    };
  }

  return {
    personA,
    personB,
    addressTermAtoB: 'Người trong họ',
    addressTermBtoA: 'Người trong họ',
    relationshipType: 'UNKNOWN',
    generationDifference: genDiff,
    pathDescription: 'Chưa đủ dữ liệu quan hệ chi tiết để xác định xưng hô chính xác',
    pathPersons: [personA, personB],
  };
}
