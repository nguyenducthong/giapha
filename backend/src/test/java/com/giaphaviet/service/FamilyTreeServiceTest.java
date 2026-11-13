package com.giaphaviet.service;

import com.giaphaviet.dto.GraphResponse;
import com.giaphaviet.model.FamilyTree;
import com.giaphaviet.model.ParentChildRelationship;
import com.giaphaviet.model.Person;
import com.giaphaviet.repository.FamilyTreeRepository;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import com.giaphaviet.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FamilyTreeServiceTest {

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private ParentChildRelationshipRepository relationshipRepository;

    @InjectMocks
    private FamilyTreeService familyTreeService;

    private UUID treeId;
    private FamilyTree tree;

    @BeforeEach
    void setUp() {
        treeId = UUID.randomUUID();
        tree = new FamilyTree();
        tree.setId(treeId);
        tree.setName("Gia Phả Họ Nguyễn Đại Tộc");
        tree.setSlug("nguyen-dai-toc");
    }

    @Test
    @DisplayName("Lấy danh sách tất cả các dòng họ")
    void testGetAllTrees() {
        when(familyTreeRepository.findAll()).thenReturn(List.of(tree));

        List<FamilyTree> trees = familyTreeService.getAllTrees();

        assertEquals(1, trees.size());
        assertEquals("Gia Phả Họ Nguyễn Đại Tộc", trees.get(0).getName());
    }

    @Test
    @DisplayName("Lấy đồ thị phả hệ cho React Flow (Nodes, Edges, Thống kê sống/mất)")
    void testGetTreeGraph() {
        Person p1 = new Person();
        p1.setId(UUID.randomUUID());
        p1.setPrimaryName("Cụ Thủy Tổ");
        p1.setStatus("DECEASED");
        p1.setGeneration(1);

        Person p2 = new Person();
        p2.setId(UUID.randomUUID());
        p2.setPrimaryName("Trưởng Tộc Đương Nhiệm");
        p2.setStatus("LIVING");
        p2.setGeneration(4);

        ParentChildRelationship rel = new ParentChildRelationship();
        rel.setParentId(p1.getId());
        rel.setChildId(p2.getId());

        when(personRepository.findByTreeIdOrderByGenerationAsc(treeId)).thenReturn(List.of(p1, p2));
        when(relationshipRepository.findByTreeId(treeId)).thenReturn(List.of(rel));

        GraphResponse response = familyTreeService.getTreeGraph(treeId);

        assertNotNull(response);
        assertEquals(2, response.getNodes().size());
        assertEquals(1, response.getEdges().size());
        assertEquals(2, response.getTotalMembers());
        assertEquals(1, response.getLivingCount());
        assertEquals(1, response.getDeceasedCount());
    }
}
