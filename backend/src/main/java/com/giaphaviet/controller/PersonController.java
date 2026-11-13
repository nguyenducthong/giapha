package com.giaphaviet.controller;

import com.giaphaviet.model.Person;
import com.giaphaviet.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/family-trees/{treeId}/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public ResponseEntity<List<Person>> getPersons(@PathVariable UUID treeId) {
        return ResponseEntity.ok(personService.getPersonsByTree(treeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable UUID treeId, @PathVariable UUID id) {
        return personService.getPersonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Person> createPerson(@PathVariable UUID treeId, @RequestBody Person person) {
        person.setTreeId(treeId);
        return ResponseEntity.ok(personService.savePerson(person));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable UUID treeId, @PathVariable UUID id) {
        return personService.deletePerson(treeId, id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(@PathVariable UUID treeId, @PathVariable UUID id, @RequestBody Person person) {
        return personService.getPersonById(id)
                .map(existing -> {
                    person.setId(id);
                    person.setTreeId(treeId);
                    return ResponseEntity.ok(personService.savePerson(person));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
