package com.giaphaviet.repository;

import com.giaphaviet.model.ClanArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClanArticleRepository extends JpaRepository<ClanArticle, UUID> {
    List<ClanArticle> findByTreeIdOrderByCreatedAtDesc(UUID treeId);
}
