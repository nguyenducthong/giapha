package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "edit_proposals")
public class EditProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    @Column(nullable = false)
    private UUID personId;

    @Column(nullable = false)
    private String personName;

    @Column(nullable = false)
    private String proposerName;

    @Column(nullable = false)
    private String fieldToChange; // Ví dụ: "Ngày giỗ", "Năm sinh", "Mộ phần"

    private String oldValue;

    @Column(nullable = false)
    private String newValue;

    @Column(columnDefinition = "TEXT")
    private String reason; // Căn cứ tài liệu hoặc lời người cao tuổi

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    private String reviewerNote;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public EditProposal() {}

    public EditProposal(UUID treeId, UUID personId, String personName, String proposerName, String fieldToChange, String oldValue, String newValue, String reason) {
        this.treeId = treeId;
        this.personId = personId;
        this.personName = personName;
        this.proposerName = proposerName;
        this.fieldToChange = fieldToChange;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.reason = reason;
        this.status = "PENDING";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public UUID getPersonId() { return personId; }
    public void setPersonId(UUID personId) { this.personId = personId; }

    public String getPersonName() { return personName; }
    public void setPersonName(String personName) { this.personName = personName; }

    public String getProposerName() { return proposerName; }
    public void setProposerName(String proposerName) { this.proposerName = proposerName; }

    public String getFieldToChange() { return fieldToChange; }
    public void setFieldToChange(String fieldToChange) { this.fieldToChange = fieldToChange; }

    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReviewerNote() { return reviewerNote; }
    public void setReviewerNote(String reviewerNote) { this.reviewerNote = reviewerNote; }

    public Instant getCreatedAt() { return createdAt; }
}
