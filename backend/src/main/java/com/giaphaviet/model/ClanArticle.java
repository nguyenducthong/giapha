package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "clan_articles")
public class ClanArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    @Column(nullable = false)
    private String title;

    private String author;

    @Column(nullable = false)
    private String category = "PHA_KY"; // PHA_KY, DI_TICH, DANH_NHAN, TOC_UOC

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String coverImageUrl;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ClanArticle() {}

    public ClanArticle(UUID treeId, String title, String author, String category, String excerpt, String content) {
        this.treeId = treeId;
        this.title = title;
        this.author = author;
        this.category = category;
        this.excerpt = excerpt;
        this.content = content;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Instant getCreatedAt() { return createdAt; }
}
