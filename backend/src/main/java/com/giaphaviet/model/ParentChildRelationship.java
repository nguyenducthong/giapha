package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "parent_child_relationships")
public class ParentChildRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    @Column(nullable = false)
    private UUID parentId;

    @Column(nullable = false)
    private UUID childId;

    private UUID unionId;

    @Column(nullable = false)
    private String relType = "BIOLOGICAL"; // BIOLOGICAL, ADOPTIVE, FOSTER

    private String notes;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ParentChildRelationship() {}

    public ParentChildRelationship(UUID treeId, UUID parentId, UUID childId, String relType) {
        this.treeId = treeId;
        this.parentId = parentId;
        this.childId = childId;
        this.relType = relType;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public UUID getParentId() { return parentId; }
    public void setParentId(UUID parentId) { this.parentId = parentId; }

    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }

    public UUID getUnionId() { return unionId; }
    public void setUnionId(UUID unionId) { this.unionId = unionId; }

    public String getRelType() { return relType; }
    public void setRelType(String relType) { this.relType = relType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
}
