package com.giaphaviet.repository;

import com.giaphaviet.model.FamilyTree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FamilyTreeRepository extends JpaRepository<FamilyTree, UUID> {
    Optional<FamilyTree> findBySlug(String slug);
}
