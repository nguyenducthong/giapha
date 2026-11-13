package com.giaphaviet.service;

import com.giaphaviet.dto.KinshipResponse;
import com.giaphaviet.model.ParentChildRelationship;
import com.giaphaviet.model.Person;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import com.giaphaviet.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KinshipServiceTest {

    @Mock
    private PersonRepository personRepository;

    @Mock
    private ParentChildRelationshipRepository relationshipRepository;

    @InjectMocks
    private KinshipService kinshipService;

    private UUID treeId;
    private UUID fatherId;
    private UUID sonId;
    private UUID cousinId;
    private Person father;
    private Person son;
    private Person cousin;

    @BeforeEach
    void setUp() {
        treeId = UUID.randomUUID();
        fatherId = UUID.randomUUID();
        sonId = UUID.randomUUID();
        cousinId = UUID.randomUUID();

        father = new Person();
        father.setId(fatherId);
        father.setTreeId(treeId);
        father.setPrimaryName("Nguyễn Quý Công");
        father.setGender("MALE");
        father.setGeneration(1);
        father.setBirthYear(1682);

        son = new Person();
        son.setId(sonId);
        son.setTreeId(treeId);
        son.setPrimaryName("Nguyễn Trọng Phúc");
        son.setGender("MALE");
        son.setGeneration(2);
        son.setBirthYear(1715);

        cousin = new Person();
        cousin.setId(cousinId);
        cousin.setTreeId(treeId);
        cousin.setPrimaryName("Nguyễn Trọng Thọ");
        cousin.setGender("MALE");
        cousin.setGeneration(2);
        cousin.setBirthYear(1722);
    }

    @Test
    @DisplayName("Kiểm tra quan hệ với chính mình")
    void testSelfRelationship() {
        when(personRepository.findById(fatherId)).thenReturn(Optional.of(father));

        KinshipResponse res = kinshipService.calculateKinship(treeId, fatherId, fatherId);

        assertNotNull(res);
        assertEquals("Chính mình", res.getAddressTermAtoB());
        assertEquals("Chính mình", res.getAddressTermBtoA());
        assertEquals(0, res.getGenerationDifference());
    }

    @Test
    @DisplayName("Kiểm tra quan hệ Trực Hệ: Cha ruột và Con trai")
    void testFatherAndSonDirectRelationship() {
        when(personRepository.findById(fatherId)).thenReturn(Optional.of(father));
        when(personRepository.findById(sonId)).thenReturn(Optional.of(son));

        ParentChildRelationship rel = new ParentChildRelationship();
        rel.setTreeId(treeId);
        rel.setParentId(fatherId);
        rel.setChildId(sonId);
        when(relationshipRepository.findByTreeId(treeId)).thenReturn(List.of(rel));

        KinshipResponse resAtoB = kinshipService.calculateKinship(treeId, fatherId, sonId);
        assertEquals("Con trai", resAtoB.getAddressTermAtoB());
        assertEquals("Bố (Cha)", resAtoB.getAddressTermBtoA());
        assertEquals(1, resAtoB.getGenerationDifference());

        KinshipResponse resBtoA = kinshipService.calculateKinship(treeId, sonId, fatherId);
        assertEquals("Bố (Cha)", resBtoA.getAddressTermAtoB());
        assertEquals("Con trai", resBtoA.getAddressTermBtoA());
        assertEquals(-1, resBtoA.getGenerationDifference());
    }

    @Test
    @DisplayName("Kiểm tra xưng hô anh em họ cùng đời (Generation Diff = 0)")
    void testCousinSameGeneration() {
        when(personRepository.findById(sonId)).thenReturn(Optional.of(son));
        when(personRepository.findById(cousinId)).thenReturn(Optional.of(cousin));
        when(relationshipRepository.findByTreeId(treeId)).thenReturn(Collections.emptyList());

        KinshipResponse res = kinshipService.calculateKinship(treeId, sonId, cousinId);

        assertNotNull(res);
        assertEquals(0, res.getGenerationDifference());
        // Son sinh 1715 (lớn hơn Cousin sinh 1722) -> son gọi cousin là "Em họ", cousin gọi son là "Anh họ"
        assertEquals("Em họ", res.getAddressTermAtoB());
        assertEquals("Anh họ", res.getAddressTermBtoA());
    }

    @Test
    @DisplayName("Kiểm tra xưng hô cách nhiều thế hệ: Cụ Tổ và Cháu chắt (GenDiff <= -2)")
    void testAncestorAndDescendant() {
        Person greatGrandSon = new Person();
        UUID ggId = UUID.randomUUID();
        greatGrandSon.setId(ggId);
        greatGrandSon.setTreeId(treeId);
        greatGrandSon.setPrimaryName("Nguyễn Trọng Tuyên");
        greatGrandSon.setGender("MALE");
        greatGrandSon.setGeneration(4);

        when(personRepository.findById(ggId)).thenReturn(Optional.of(greatGrandSon));
        when(personRepository.findById(fatherId)).thenReturn(Optional.of(father));
        when(relationshipRepository.findByTreeId(treeId)).thenReturn(Collections.emptyList());

        KinshipResponse res = kinshipService.calculateKinship(treeId, ggId, fatherId);

        assertEquals(-3, res.getGenerationDifference());
        assertEquals("Cụ ông / Tiên Tổ", res.getAddressTermAtoB());
        assertEquals("Cháu chắt", res.getAddressTermBtoA());
    }
}
