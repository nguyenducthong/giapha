package com.giaphaviet.repository;

import com.giaphaviet.model.EditProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EditProposalRepository extends JpaRepository<EditProposal, UUID> {
    List<EditProposal> findByTreeIdOrderByCreatedAtDesc(UUID treeId);
    List<EditProposal> findByTreeIdAndStatusOrderByCreatedAtDesc(UUID treeId, String status);
}
