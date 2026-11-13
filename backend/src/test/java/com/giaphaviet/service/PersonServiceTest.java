package com.giaphaviet.service;

import com.giaphaviet.model.Person;
import com.giaphaviet.model.ParentChildRelationship;
import com.giaphaviet.repository.PersonRepository;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class PersonServiceTest {
    @Test
    void deletesOnlyTargetAndItsRelationships() {
        var persons = mock(PersonRepository.class);
        var relationships = mock(ParentChildRelationshipRepository.class);
        var service = new PersonService(persons, relationships);
        var tree = UUID.randomUUID();
        var id = UUID.randomUUID();
        var person = new Person(); person.setId(id); person.setTreeId(tree);
        var parentLink = new ParentChildRelationship(tree, id, UUID.randomUUID(), "BIOLOGICAL");
        var childLink = new ParentChildRelationship(tree, UUID.randomUUID(), id, "BIOLOGICAL");
        when(persons.findById(id)).thenReturn(Optional.of(person));
        when(relationships.findByParentId(id)).thenReturn(List.of(parentLink));
        when(relationships.findByChildId(id)).thenReturn(List.of(childLink));
        assertTrue(service.deletePerson(tree, id));
        verify(relationships).deleteAll(List.of(parentLink));
        verify(relationships).deleteAll(List.of(childLink));
        verify(persons).delete(person);
        verify(persons, never()).deleteAll(anyIterable());
    }

    @Test
    void refusesDeletionFromAnotherTreeOrMissingPerson() {
        var persons = mock(PersonRepository.class);
        var relationships = mock(ParentChildRelationshipRepository.class);
        var service = new PersonService(persons, relationships);
        var id = UUID.randomUUID();
        var person = new Person(); person.setTreeId(UUID.randomUUID());
        when(persons.findById(id)).thenReturn(Optional.of(person));
        assertFalse(service.deletePerson(UUID.randomUUID(), id));
        verifyNoInteractions(relationships);
        verify(persons, never()).delete(any());
        when(persons.findById(id)).thenReturn(Optional.empty());
        assertFalse(service.deletePerson(UUID.randomUUID(), id));
    }
}
