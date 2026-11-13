package com.giaphaviet.repository;

import com.giaphaviet.model.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, UUID> {
    List<MediaAsset> findByTreeIdOrderByCreatedAtDesc(UUID treeId);
    List<MediaAsset> findByTreeIdAndMediaTypeOrderByCreatedAtDesc(UUID treeId, String mediaType);
}
