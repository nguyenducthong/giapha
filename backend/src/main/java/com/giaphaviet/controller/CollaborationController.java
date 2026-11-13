package com.giaphaviet.controller;

import com.giaphaviet.model.ClanArticle;
import com.giaphaviet.model.ClanEvent;
import com.giaphaviet.model.EditProposal;
import com.giaphaviet.model.MediaAsset;
import com.giaphaviet.service.CollaborationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/family-trees/{treeId}")
public class CollaborationController {

    private final CollaborationService collaborationService;

    public CollaborationController(CollaborationService collaborationService) {
        this.collaborationService = collaborationService;
    }

    // 1. Phả Ký & Bài Viết
    @GetMapping("/articles")
    public ResponseEntity<List<ClanArticle>> getArticles(@PathVariable UUID treeId) {
        return ResponseEntity.ok(collaborationService.getArticles(treeId));
    }

    @PostMapping("/articles")
    public ResponseEntity<ClanArticle> createArticle(@PathVariable UUID treeId, @RequestBody ClanArticle article) {
        article.setTreeId(treeId);
        return ResponseEntity.ok(collaborationService.saveArticle(article));
    }

    // 2. Đề Xuất Chỉnh Sửa & Phê Duyệt
    @GetMapping("/proposals")
    public ResponseEntity<List<EditProposal>> getProposals(@PathVariable UUID treeId) {
        return ResponseEntity.ok(collaborationService.getProposals(treeId));
    }

    @PostMapping("/proposals")
    public ResponseEntity<EditProposal> submitProposal(@PathVariable UUID treeId, @RequestBody EditProposal proposal) {
        proposal.setTreeId(treeId);
        return ResponseEntity.ok(collaborationService.submitProposal(proposal));
    }

    @PatchMapping("/proposals/{proposalId}")
    public ResponseEntity<EditProposal> reviewProposal(
            @PathVariable UUID treeId,
            @PathVariable UUID proposalId,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "APPROVED");
        String note = body.getOrDefault("note", "Đã phê duyệt bởi Hội đồng gia tộc");
        return ResponseEntity.ok(collaborationService.reviewProposal(proposalId, status, note));
    }

    // 3. Thư Viện Ảnh & Tư Liệu Số
    @GetMapping("/media")
    public ResponseEntity<List<MediaAsset>> getMedia(@PathVariable UUID treeId) {
        return ResponseEntity.ok(collaborationService.getMedia(treeId));
    }

    @PostMapping("/media")
    public ResponseEntity<MediaAsset> saveMedia(@PathVariable UUID treeId, @RequestBody MediaAsset media) {
        media.setTreeId(treeId);
        return ResponseEntity.ok(collaborationService.saveMedia(media));
    }

    @PutMapping("/media/{mediaId}")
    public ResponseEntity<MediaAsset> updateMedia(
            @PathVariable UUID treeId,
            @PathVariable UUID mediaId,
            @RequestBody MediaAsset media
    ) {
        media.setTreeId(treeId);
        return ResponseEntity.ok(collaborationService.updateMedia(mediaId, media));
    }

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable UUID treeId,
            @PathVariable UUID mediaId
    ) {
        collaborationService.deleteMedia(mediaId);
        return ResponseEntity.noContent().build();
    }

    // 4. Lịch Giỗ & Sự Kiện
    @GetMapping("/events")
    public ResponseEntity<List<ClanEvent>> getEvents(@PathVariable UUID treeId) {
        return ResponseEntity.ok(collaborationService.getEvents(treeId));
    }
}
