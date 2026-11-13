package com.giaphaviet.service;

import com.giaphaviet.dto.GraphResponse;
import com.giaphaviet.model.FamilyTree;
import com.giaphaviet.model.ParentChildRelationship;
import com.giaphaviet.model.Person;
import com.giaphaviet.repository.FamilyTreeRepository;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import com.giaphaviet.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FamilyTreeService {

    private final FamilyTreeRepository familyTreeRepository;
    private final PersonRepository personRepository;
    private final ParentChildRelationshipRepository relationshipRepository;

    public FamilyTreeService(
            FamilyTreeRepository familyTreeRepository,
            PersonRepository personRepository,
            ParentChildRelationshipRepository relationshipRepository
    ) {
        this.familyTreeRepository = familyTreeRepository;
        this.personRepository = personRepository;
        this.relationshipRepository = relationshipRepository;
    }

    public List<FamilyTree> getAllTrees() {
        return familyTreeRepository.findAll();
    }

    public Optional<FamilyTree> getTreeById(UUID id) {
        return familyTreeRepository.findById(id);
    }

    public Optional<FamilyTree> getTreeBySlug(String slug) {
        return familyTreeRepository.findBySlug(slug);
    }

    public GraphResponse getTreeGraph(UUID treeId) {
        List<Person> persons = personRepository.findByTreeIdOrderByGenerationAsc(treeId);
        List<ParentChildRelationship> edges = relationshipRepository.findByTreeId(treeId);

        long total = persons.size();
        long living = persons.stream().filter(p -> "LIVING".equals(p.getStatus())).count();
        long deceased = persons.stream().filter(p -> "DECEASED".equals(p.getStatus())).count();

        return new GraphResponse(persons, edges, total, living, deceased);
    }
}
