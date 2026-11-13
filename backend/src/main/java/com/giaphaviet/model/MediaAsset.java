package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "media_assets")
public class MediaAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    private UUID relatedPersonId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String mediaType = "PHOTO"; // PHOTO, VIDEO, HISTORICAL_DOCUMENT, ALTAR_RESTORED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(columnDefinition = "TEXT")
    private String caption;

    @Column(columnDefinition = "TEXT")
    private String transcription;

    private String location;
    private Integer takenYear;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public MediaAsset() {}

    public MediaAsset(UUID treeId, String title, String mediaType, String fileUrl, String caption, Integer takenYear) {
        this.treeId = treeId;
        this.title = title;
        this.mediaType = mediaType;
        this.fileUrl = fileUrl;
        this.caption = caption;
        this.takenYear = takenYear;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public UUID getRelatedPersonId() { return relatedPersonId; }
    public void setRelatedPersonId(UUID relatedPersonId) { this.relatedPersonId = relatedPersonId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getTranscription() { return transcription; }
    public void setTranscription(String transcription) { this.transcription = transcription; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getTakenYear() { return takenYear; }
    public void setTakenYear(Integer takenYear) { this.takenYear = takenYear; }

    public Instant getCreatedAt() { return createdAt; }
}
