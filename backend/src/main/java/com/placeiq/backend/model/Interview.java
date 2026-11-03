package com.placeiq.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String company;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "round_type", nullable = false)
    private String roundType;

    @Column(name = "mode", nullable = false)
    private String mode;

    @Column(name = "interview_at", nullable = false)
    private LocalDateTime interviewAt;

    @Column(name = "is_done", nullable = false)
    private boolean done;

    // prep checklist saved as a number from 0 to 15 (each of the 4 tasks is one bit)
    @Column(name = "prep_done", nullable = false)
    private int prepDone;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRoundType() { return roundType; }
    public void setRoundType(String roundType) { this.roundType = roundType; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public LocalDateTime getInterviewAt() { return interviewAt; }
    public void setInterviewAt(LocalDateTime interviewAt) { this.interviewAt = interviewAt; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public int getPrepDone() { return prepDone; }
    public void setPrepDone(int prepDone) { this.prepDone = prepDone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}