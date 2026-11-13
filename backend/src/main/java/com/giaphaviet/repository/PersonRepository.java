package com.giaphaviet.repository;

import com.giaphaviet.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {
    List<Person> findByTreeIdOrderByGenerationAsc(UUID treeId);
    List<Person> findByTreeIdAndGeneration(UUID treeId, Integer generation);
    long countByTreeId(UUID treeId);
    long countByTreeIdAndStatus(UUID treeId, String status);
}
