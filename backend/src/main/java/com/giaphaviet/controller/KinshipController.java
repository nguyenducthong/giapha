package com.giaphaviet.controller;

import com.giaphaviet.dto.KinshipResponse;
import com.giaphaviet.service.KinshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/family-trees/{treeId}/relationship-path")
public class KinshipController {

    private final KinshipService kinshipService;

    public KinshipController(KinshipService kinshipService) {
        this.kinshipService = kinshipService;
    }

    @GetMapping
    public ResponseEntity<KinshipResponse> getRelationshipPath(
            @PathVariable UUID treeId,
            @RequestParam UUID fromId,
            @RequestParam UUID toId
    ) {
        return ResponseEntity.ok(kinshipService.calculateKinship(treeId, fromId, toId));
    }
}
