package com.giaphaviet.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "clan_events")
public class ClanEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID treeId;

    private UUID relatedPersonId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String eventType = "DEATH_ANNIVERSARY";

    @Column(nullable = false)
    private String dateLunar;

    private LocalDate dateSolar;

    @Column(nullable = false)
    private boolean recurrenceAnnual = true;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ClanEvent() {}

    public ClanEvent(UUID treeId, UUID relatedPersonId, String title, String eventType, String dateLunar, String location, String description) {
        this.treeId = treeId;
        this.relatedPersonId = relatedPersonId;
        this.title = title;
        this.eventType = eventType;
        this.dateLunar = dateLunar;
        this.location = location;
        this.description = description;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTreeId() { return treeId; }
    public void setTreeId(UUID treeId) { this.treeId = treeId; }

    public UUID getRelatedPersonId() { return relatedPersonId; }
    public void setRelatedPersonId(UUID relatedPersonId) { this.relatedPersonId = relatedPersonId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getDateLunar() { return dateLunar; }
    public void setDateLunar(String dateLunar) { this.dateLunar = dateLunar; }

    public LocalDate getDateSolar() { return dateSolar; }
    public void setDateSolar(LocalDate dateSolar) { this.dateSolar = dateSolar; }

    public boolean isRecurrenceAnnual() { return recurrenceAnnual; }
    public void setRecurrenceAnnual(boolean recurrenceAnnual) { this.recurrenceAnnual = recurrenceAnnual; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
}
