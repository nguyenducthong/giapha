package com.giaphaviet.service;

import com.giaphaviet.model.Person;
import com.giaphaviet.repository.PersonRepository;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final ParentChildRelationshipRepository relationships;

    public PersonService(PersonRepository personRepository, ParentChildRelationshipRepository relationships) {
        this.personRepository = personRepository;
        this.relationships = relationships;
    }

    public List<Person> getPersonsByTree(UUID treeId) {
        return personRepository.findByTreeIdOrderByGenerationAsc(treeId);
    }

    public Optional<Person> getPersonById(UUID personId) {
        return personRepository.findById(personId);
    }

    public Person savePerson(Person person) {
        return personRepository.save(person);
    }

    @Transactional
    public boolean deletePerson(UUID treeId, UUID personId) {
        var person = personRepository.findById(personId);
        if (person.isEmpty() || !treeId.equals(person.get().getTreeId())) return false;
        relationships.deleteAll(relationships.findByParentId(personId));
        relationships.deleteAll(relationships.findByChildId(personId));
        personRepository.delete(person.get());
        return true;
    }
}
