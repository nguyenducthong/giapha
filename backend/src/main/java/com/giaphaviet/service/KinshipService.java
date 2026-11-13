package com.giaphaviet.service;

import com.giaphaviet.dto.KinshipResponse;
import com.giaphaviet.model.ParentChildRelationship;
import com.giaphaviet.model.Person;
import com.giaphaviet.repository.ParentChildRelationshipRepository;
import com.giaphaviet.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KinshipService {

    private final PersonRepository personRepository;
    private final ParentChildRelationshipRepository relationshipRepository;

    public KinshipService(PersonRepository personRepository, ParentChildRelationshipRepository relationshipRepository) {
        this.personRepository = personRepository;
        this.relationshipRepository = relationshipRepository;
    }

    public KinshipResponse calculateKinship(UUID treeId, UUID fromId, UUID toId) {
        Person personA = personRepository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên A"));
        Person personB = personRepository.findById(toId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành viên B"));

        if (fromId.equals(toId)) {
            return new KinshipResponse(
                    personA, personB, "Chính mình", "Chính mình", 0,
                    "Cùng một thành viên trong dòng họ", List.of(personA)
            );
        }

        List<ParentChildRelationship> allRels = relationshipRepository.findByTreeId(treeId);

        // Check if A is direct parent of B
        boolean isParent = allRels.stream().anyMatch(r -> r.getParentId().equals(fromId) && r.getChildId().equals(toId));
        if (isParent) {
            String termAtoB = "MALE".equals(personB.getGender()) ? "Con trai" : "Con gái";
            String termBtoA = "MALE".equals(personA.getGender()) ? "Bố (Cha)" : "Mẹ";
            return new KinshipResponse(
                    personA, personB, termAtoB, termBtoA, 1,
                    personA.getPrimaryName() + " là bậc sinh thành của " + personB.getPrimaryName(),
                    List.of(personA, personB)
            );
        }

        // Check if B is direct parent of A
        boolean isChild = allRels.stream().anyMatch(r -> r.getParentId().equals(toId) && r.getChildId().equals(fromId));
        if (isChild) {
            String termAtoB = "MALE".equals(personB.getGender()) ? "Bố (Cha)" : "Mẹ";
            String termBtoA = "MALE".equals(personA.getGender()) ? "Con trai" : "Con gái";
            return new KinshipResponse(
                    personA, personB, termAtoB, termBtoA, -1,
                    personB.getPrimaryName() + " là bậc sinh thành của " + personA.getPrimaryName(),
                    List.of(personB, personA)
            );
        }

        int genDiff = personB.getGeneration() - personA.getGeneration();

        String addressAtoB = "Người trong họ";
        String addressBtoA = "Người trong họ";
        String description = "Cùng thuộc dòng họ.";

        if (genDiff == 0) {
            boolean isBOlder = (personB.getBirthYear() != null ? personB.getBirthYear() : 0) <= 
                               (personA.getBirthYear() != null ? personA.getBirthYear() : 0);
            addressAtoB = isBOlder ? ("MALE".equals(personB.getGender()) ? "Anh họ" : "Chị họ") : "Em họ";
            addressBtoA = isBOlder ? "Em họ" : ("MALE".equals(personA.getGender()) ? "Anh họ" : "Chị họ");
            description = "Cùng thuộc Đời thứ " + personA.getGeneration() + " trong dòng họ.";
        } else if (genDiff == -1) {
            addressAtoB = "MALE".equals(personB.getGender()) ? "Bác họ / Chú họ" : "Cô họ";
            addressBtoA = "Cháu họ";
            description = personB.getPrimaryName() + " thuộc Đời " + personB.getGeneration() + ", là bậc chú bác của " + personA.getPrimaryName() + " (Đời " + personA.getGeneration() + ").";
        } else if (genDiff == 1) {
            addressAtoB = "Cháu họ";
            addressBtoA = "MALE".equals(personA.getGender()) ? "Bác họ / Chú họ" : "Cô họ";
            description = personA.getPrimaryName() + " là bậc chú bác đối với " + personB.getPrimaryName() + ".";
        } else if (genDiff <= -2) {
            addressAtoB = "MALE".equals(personB.getGender()) ? "Cụ ông / Tiên Tổ" : "Cụ bà / Tiên Tổ";
            addressBtoA = "Cháu chắt";
            description = personB.getPrimaryName() + " là bậc tiền bối, cách " + Math.abs(genDiff) + " thế hệ.";
        } else {
            addressAtoB = "Cháu chắt nội tộc";
            addressBtoA = "Bậc tiền bối";
            description = personA.getPrimaryName() + " là bậc tiền bối cách " + genDiff + " thế hệ đối với " + personB.getPrimaryName() + ".";
        }

        return new KinshipResponse(
                personA, personB, addressAtoB, addressBtoA, genDiff,
                description, List.of(personA, personB)
        );
    }
}
