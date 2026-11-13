package com.giaphaviet.repository;

import com.giaphaviet.model.ClanEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClanEventRepository extends JpaRepository<ClanEvent, UUID> {
    List<ClanEvent> findByTreeIdOrderByCreatedAtDesc(UUID treeId);
}
