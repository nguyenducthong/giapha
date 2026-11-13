package com.giaphaviet.controller;

import com.giaphaviet.dto.GraphResponse;
import com.giaphaviet.model.FamilyTree;
import com.giaphaviet.service.FamilyTreeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/family-trees")
public class FamilyTreeController {

    private final FamilyTreeService familyTreeService;

    public FamilyTreeController(FamilyTreeService familyTreeService) {
        this.familyTreeService = familyTreeService;
    }

    @GetMapping
    public ResponseEntity<List<FamilyTree>> getAllTrees() {
        return ResponseEntity.ok(familyTreeService.getAllTrees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamilyTree> getTreeById(@PathVariable UUID id) {
        return familyTreeService.getTreeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/graph")
    public ResponseEntity<GraphResponse> getTreeGraph(@PathVariable UUID id) {
        return ResponseEntity.ok(familyTreeService.getTreeGraph(id));
    }
}
