package com.giaphaviet.service;

import com.giaphaviet.model.ClanArticle;
import com.giaphaviet.model.EditProposal;
import com.giaphaviet.repository.ClanArticleRepository;
import com.giaphaviet.repository.ClanEventRepository;
import com.giaphaviet.repository.EditProposalRepository;
import com.giaphaviet.repository.MediaAssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollaborationServiceTest {

    @Mock
    private ClanArticleRepository articleRepository;

    @Mock
    private EditProposalRepository proposalRepository;

    @Mock
    private MediaAssetRepository mediaRepository;

    @Mock
    private ClanEventRepository eventRepository;

    @InjectMocks
    private CollaborationService collaborationService;

    private UUID treeId;
    private UUID proposalId;
    private EditProposal proposal;

    @BeforeEach
    void setUp() {
        treeId = UUID.randomUUID();
        proposalId = UUID.randomUUID();

        proposal = new EditProposal();
        proposal.setId(proposalId);
        proposal.setTreeId(treeId);
        proposal.setProposerName("Nguyễn Văn Minh");
        proposal.setFieldToChange("Nơi an táng");
        proposal.setStatus("PENDING");
    }

    @Test
    @DisplayName("Nộp đề xuất chỉnh sửa mới mặc định có trạng thái PENDING")
    void testSubmitProposal() {
        when(proposalRepository.save(any(EditProposal.class))).thenAnswer(i -> i.getArgument(0));

        EditProposal saved = collaborationService.submitProposal(proposal);

        assertNotNull(saved);
        assertEquals("PENDING", saved.getStatus());
        verify(proposalRepository, times(1)).save(proposal);
    }

    @Test
    @DisplayName("Phê duyệt đề xuất chỉnh sửa thành APPROVED kèm ghi chú")
    void testReviewProposalApproved() {
        when(proposalRepository.findById(proposalId)).thenReturn(Optional.of(proposal));
        when(proposalRepository.save(any(EditProposal.class))).thenAnswer(i -> i.getArgument(0));

        EditProposal reviewed = collaborationService.reviewProposal(proposalId, "APPROVED", "Đã đối chiếu mộc bản gia phả.");

        assertEquals("APPROVED", reviewed.getStatus());
        assertEquals("Đã đối chiếu mộc bản gia phả.", reviewed.getReviewerNote());
    }

    @Test
    @DisplayName("Lưu bài viết phả ký")
    void testSaveArticle() {
        ClanArticle article = new ClanArticle();
        article.setTitle("Lời tựa gia phả khắc gỗ");
        when(articleRepository.save(article)).thenReturn(article);

        ClanArticle saved = collaborationService.saveArticle(article);

        assertNotNull(saved);
        assertEquals("Lời tựa gia phả khắc gỗ", saved.getTitle());
    }
}
