package com.giaphaviet.service;

import com.giaphaviet.model.ClanArticle;
import com.giaphaviet.model.ClanEvent;
import com.giaphaviet.model.EditProposal;
import com.giaphaviet.model.MediaAsset;
import com.giaphaviet.repository.ClanArticleRepository;
import com.giaphaviet.repository.ClanEventRepository;
import com.giaphaviet.repository.EditProposalRepository;
import com.giaphaviet.repository.MediaAssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CollaborationService {

    private final ClanArticleRepository articleRepository;
    private final EditProposalRepository proposalRepository;
    private final MediaAssetRepository mediaRepository;
    private final ClanEventRepository eventRepository;

    public CollaborationService(
            ClanArticleRepository articleRepository,
            EditProposalRepository proposalRepository,
            MediaAssetRepository mediaRepository,
            ClanEventRepository eventRepository
    ) {
        this.articleRepository = articleRepository;
        this.proposalRepository = proposalRepository;
        this.mediaRepository = mediaRepository;
        this.eventRepository = eventRepository;
    }

    public List<ClanArticle> getArticles(UUID treeId) {
        return articleRepository.findByTreeIdOrderByCreatedAtDesc(treeId);
    }

    public ClanArticle saveArticle(ClanArticle article) {
        return articleRepository.save(article);
    }

    public List<EditProposal> getProposals(UUID treeId) {
        return proposalRepository.findByTreeIdOrderByCreatedAtDesc(treeId);
    }

    public EditProposal submitProposal(EditProposal proposal) {
        proposal.setStatus("PENDING");
        return proposalRepository.save(proposal);
    }

    public EditProposal reviewProposal(UUID proposalId, String status, String note) {
        EditProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề xuất"));
        proposal.setStatus(status);
        proposal.setReviewerNote(note);
        return proposalRepository.save(proposal);
    }

    public List<MediaAsset> getMedia(UUID treeId) {
        return mediaRepository.findByTreeIdOrderByCreatedAtDesc(treeId);
    }

    public MediaAsset saveMedia(MediaAsset media) {
        return mediaRepository.save(media);
    }

    public MediaAsset updateMedia(UUID mediaId, MediaAsset updated) {
        MediaAsset existing = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư liệu"));
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getMediaType() != null) existing.setMediaType(updated.getMediaType());
        if (updated.getFileUrl() != null) existing.setFileUrl(updated.getFileUrl());
        existing.setCaption(updated.getCaption());
        existing.setTranscription(updated.getTranscription());
        existing.setLocation(updated.getLocation());
        existing.setTakenYear(updated.getTakenYear());
        existing.setRelatedPersonId(updated.getRelatedPersonId());
        return mediaRepository.save(existing);
    }

    public void deleteMedia(UUID mediaId) {
        mediaRepository.deleteById(mediaId);
    }

    public List<ClanEvent> getEvents(UUID treeId) {
        return eventRepository.findByTreeIdOrderByCreatedAtDesc(treeId);
    }
}
