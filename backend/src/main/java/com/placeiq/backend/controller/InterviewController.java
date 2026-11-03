package com.placeiq.backend.controller;

import com.placeiq.backend.model.Interview;
import com.placeiq.backend.repository.InterviewRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private static final Set<String> ROUNDS = Set.of("Technical", "HR", "Managerial");
    private static final Set<String> MODES = Set.of("Video", "Phone", "On-site");

    private final InterviewRepository repo;

    public InterviewController(InterviewRepository repo) {
        this.repo = repo;
    }

    public record InterviewRequest(
            @NotBlank String company,
            @NotBlank String role,
            String roundType,
            String mode,
            @NotNull LocalDateTime interviewAt) {
    }

    public record PrepRequest(@Min(0) @Max(15) int prepDone) {
    }

    private Long uid(Jwt jwt) {
        Number n = jwt.getClaim("uid");
        return n.longValue();
    }

    private ResponseEntity<?> notFound() {
        return ResponseEntity.status(404).body(Map.of("error", "Interview not found"));
    }

    @GetMapping
    public List<Interview> list(@AuthenticationPrincipal Jwt jwt) {
        return repo.findByUserIdOrderByInterviewAtAsc(uid(jwt));
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody InterviewRequest req) {
        String round = req.roundType() == null ? "Technical" : req.roundType();
        String mode = req.mode() == null ? "Video" : req.mode();
        if (!ROUNDS.contains(round) || !MODES.contains(mode)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid round or mode"));
        }
        Interview i = new Interview();
        i.setUserId(uid(jwt));
        i.setCompany(req.company().trim());
        i.setRole(req.role().trim());
        i.setRoundType(round);
        i.setMode(mode);
        i.setInterviewAt(req.interviewAt());
        i.setDone(false);
        i.setPrepDone(0);
        return ResponseEntity.status(201).body(repo.save(i));
    }

    @PatchMapping("/{id}/done")
    public ResponseEntity<?> toggleDone(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(i -> {
            i.setDone(!i.isDone());
            return ResponseEntity.ok(repo.save(i));
        }).orElseGet(this::notFound);
    }

    @PatchMapping("/{id}/prep")
    public ResponseEntity<?> prep(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
                                  @Valid @RequestBody PrepRequest req) {
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(i -> {
            i.setPrepDone(req.prepDone());
            return ResponseEntity.ok(repo.save(i));
        }).orElseGet(this::notFound);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return repo.findByIdAndUserId(id, uid(jwt)).<ResponseEntity<?>>map(i -> {
            repo.delete(i);
            return ResponseEntity.noContent().build();
        }).orElseGet(this::notFound);
    }
}