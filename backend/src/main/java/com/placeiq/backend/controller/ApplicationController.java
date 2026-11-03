package com.placeiq.backend.controller;

import com.placeiq.backend.model.JobApplication;
import com.placeiq.backend.repository.JobApplicationRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private static final Set<String> STATUSES = Set.of("Applied", "Shortlisted", "Interview", "Offer", "Rejected");
    private static final Set<String> MODES = Set.of("Remote", "Hybrid", "On-site");

    private final JobApplicationRepository repo;

    public ApplicationController(JobApplicationRepository repo) {
        this.repo = repo;
    }

    public record AppRequest(
            @NotBlank String company,
            @NotBlank String role,
            String status,
            String workMode,
            LocalDate appliedOn) {
    }

    public record StatusRequest(@NotBlank String status) {
    }

    private Long uid(Jwt jwt) {
        Number n = jwt.getClaim("uid");
        return n.longValue();
    }

    private ResponseEntity<?> bad() {
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid status or work mode"));
    }

    private ResponseEntity<?> notFound() {
        return ResponseEntity.status(404).body(Map.of("error", "Application not found"));
    }

    @GetMapping
    public List<JobApplication> list(@AuthenticationPrincipal Jwt jwt) {
        return repo.findByUserIdOrderByAppliedOnDescIdDesc(uid(jwt));
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AppRequest req) {
        String status = req.status() == null ? "Applied" : req.status();
        String mode = req.workMode() == null ? "Hybrid" : req.workMode();
        if (!STATUSES.contains(status) || !MODES.contains(mode)) {
            return bad();
        }
        JobApplication a = new JobApplication();
        a.setUserId(uid(jwt));
        a.setCompany(req.company().trim());
        a.setRole(req.role().trim());
        a.setStatus(status);
        a.setWorkMode(mode);
        a.setAppliedOn(req.appliedOn() == null ? LocalDate.now() : req.appliedOn());
        return ResponseEntity.status(201).body(repo.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
                                    @Valid @RequestBody AppRequest req) {
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(a -> {
            String status = req.status() == null ? a.getStatus() : req.status();
            String mode = req.workMode() == null ? a.getWorkMode() : req.workMode();
            if (!STATUSES.contains(status) || !MODES.contains(mode)) {
                return bad();
            }
            a.setCompany(req.company().trim());
            a.setRole(req.role().trim());
            a.setStatus(status);
            a.setWorkMode(mode);
            if (req.appliedOn() != null) {
                a.setAppliedOn(req.appliedOn());
            }
            return ResponseEntity.ok(repo.save(a));
        }).orElseGet(this::notFound);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> move(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
                                  @Valid @RequestBody StatusRequest req) {
        if (!STATUSES.contains(req.status())) {
            return bad();
        }
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(a -> {
            a.setStatus(req.status());
            return ResponseEntity.ok(repo.save(a));
        }).orElseGet(this::notFound);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(a -> {
            repo.delete(a);
            return ResponseEntity.noContent().build();
        }).orElseGet(this::notFound);
    }
}