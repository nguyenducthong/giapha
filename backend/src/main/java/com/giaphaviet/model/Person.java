package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "persons")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    private UUID branchId;

    @Column(nullable = false)
    private String primaryName;

    private String courtesyName;

    @Column(nullable = false)
    private String gender = "MALE"; // MALE, FEMALE, OTHER

    @Column(nullable = false)
    private Integer generation = 1;

    @Column(nullable = false)
    private String status = "LIVING"; // LIVING, DECEASED, UNKNOWN

    @Column(nullable = false)
    private boolean isLineage = true;

    private String orderInFamily; // Trưởng nam, Thứ nam, Trưởng nữ...
    private String branchName;

    private Integer birthYear;
    private Integer deathYear;

    private String lunarBirthDate;
    private String lunarDeathDate; // Ngày giỗ Âm lịch (e.g. 15/08 Âm lịch)
    private String lunarDeathCanChi;

    private String birthPlace;
    private String originPlace;
    private String currentResidence;
    private String tombLocation;

    // Thân thế bên ngoại (Gốc tích quê ngoại & thông tin Dâu/Rể)
    private String maternalClanName;     // Dòng họ bên ngoại (ví dụ: Lê Tộc, Trần Tộc)
    private String maternalOriginPlace;  // Quê ngoại / Bản quán bên ngoại
    private String maternalFather;       // Cụ Thân Sinh bên ngoại (Ông Ngoại)
    private String maternalMother;       // Cụ Thân Sinh bên ngoại (Bà Ngoại)

    @Column(columnDefinition = "TEXT")
    private String maternalNotes;        // Ghi chú thân thế bên ngoại

    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(nullable = false)
    private boolean isPrivacyProtected = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public Person() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public UUID getBranchId() { return branchId; }
    public void setBranchId(UUID branchId) { this.branchId = branchId; }

    public String getPrimaryName() { return primaryName; }
    public void setPrimaryName(String primaryName) { this.primaryName = primaryName; }

    public String getCourtesyName() { return courtesyName; }
    public void setCourtesyName(String courtesyName) { this.courtesyName = courtesyName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getGeneration() { return generation; }
    public void setGeneration(Integer generation) { this.generation = generation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isLineage() { return isLineage; }
    public void setLineage(boolean lineage) { isLineage = lineage; }

    public String getOrderInFamily() { return orderInFamily; }
    public void setOrderInFamily(String orderInFamily) { this.orderInFamily = orderInFamily; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public Integer getBirthYear() { return birthYear; }
    public void setBirthYear(Integer birthYear) { this.birthYear = birthYear; }

    public Integer getDeathYear() { return deathYear; }
    public void setDeathYear(Integer deathYear) { this.deathYear = deathYear; }

    public String getLunarBirthDate() { return lunarBirthDate; }
    public void setLunarBirthDate(String lunarBirthDate) { this.lunarBirthDate = lunarBirthDate; }

    public String getLunarDeathDate() { return lunarDeathDate; }
    public void setLunarDeathDate(String lunarDeathDate) { this.lunarDeathDate = lunarDeathDate; }

    public String getLunarDeathCanChi() { return lunarDeathCanChi; }
    public void setLunarDeathCanChi(String lunarDeathCanChi) { this.lunarDeathCanChi = lunarDeathCanChi; }

    public String getBirthPlace() { return birthPlace; }
    public void setBirthPlace(String birthPlace) { this.birthPlace = birthPlace; }

    public String getOriginPlace() { return originPlace; }
    public void setOriginPlace(String originPlace) { this.originPlace = originPlace; }

    public String getCurrentResidence() { return currentResidence; }
    public void setCurrentResidence(String currentResidence) { this.currentResidence = currentResidence; }

    public String getTombLocation() { return tombLocation; }
    public void setTombLocation(String tombLocation) { this.tombLocation = tombLocation; }

    public String getMaternalClanName() { return maternalClanName; }
    public void setMaternalClanName(String maternalClanName) { this.maternalClanName = maternalClanName; }

    public String getMaternalOriginPlace() { return maternalOriginPlace; }
    public void setMaternalOriginPlace(String maternalOriginPlace) { this.maternalOriginPlace = maternalOriginPlace; }

    public String getMaternalFather() { return maternalFather; }
    public void setMaternalFather(String maternalFather) { this.maternalFather = maternalFather; }

    public String getMaternalMother() { return maternalMother; }
    public void setMaternalMother(String maternalMother) { this.maternalMother = maternalMother; }

    public String getMaternalNotes() { return maternalNotes; }
    public void setMaternalNotes(String maternalNotes) { this.maternalNotes = maternalNotes; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public boolean isPrivacyProtected() { return isPrivacyProtected; }
    public void setPrivacyProtected(boolean privacyProtected) { isPrivacyProtected = privacyProtected; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
