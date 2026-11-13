package com.giaphaviet.repository;

import com.giaphaviet.model.ParentChildRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ParentChildRelationshipRepository extends JpaRepository<ParentChildRelationship, UUID> {
    List<ParentChildRelationship> findByTreeId(UUID treeId);
    List<ParentChildRelationship> findByParentId(UUID parentId);
    List<ParentChildRelationship> findByChildId(UUID childId);
}
