package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "family_trees")
public class FamilyTree {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String ancestralHall;
    private String originPlace;
    private Integer foundedYear;

    @Column(columnDefinition = "TEXT")
    private String coupletText;

    @Column(columnDefinition = "TEXT")
    private String historySummary;

    private String patriarchName;
    private String coverImageUrl;

    @Column(nullable = false)
    private boolean isPublic = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public FamilyTree() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAncestralHall() { return ancestralHall; }
    public void setAncestralHall(String ancestralHall) { this.ancestralHall = ancestralHall; }

    public String getOriginPlace() { return originPlace; }
    public void setOriginPlace(String originPlace) { this.originPlace = originPlace; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public String getCoupletText() { return coupletText; }
    public void setCoupletText(String coupletText) { this.coupletText = coupletText; }

    public String getHistorySummary() { return historySummary; }
    public void setHistorySummary(String historySummary) { this.historySummary = historySummary; }

    public String getPatriarchName() { return patriarchName; }
    public void setPatriarchName(String patriarchName) { this.patriarchName = patriarchName; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
