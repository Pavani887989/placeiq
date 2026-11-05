package com.placeiq.backend.controller;

import com.placeiq.backend.model.Interview;
import com.placeiq.backend.model.JobApplication;
import com.placeiq.backend.repository.InterviewRepository;
import com.placeiq.backend.repository.JobApplicationRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {

    private static final List<String> STATUSES = List.of("Applied", "Shortlisted", "Interview", "Offer", "Rejected");
    private static final List<String> MODES = List.of("Remote", "Hybrid", "On-site");
    private static final List<String> ROUNDS = List.of("Technical", "HR", "Managerial");

    private final JobApplicationRepository apps;
    private final InterviewRepository interviews;

    public InsightsController(JobApplicationRepository apps, InterviewRepository interviews) {
        this.apps = apps;
        this.interviews = interviews;
    }

    private static long count(List<JobApplication> list, Set<String> statuses) {
        return list.stream().filter(x -> statuses.contains(x.getStatus())).count();
    }

    @GetMapping
    public Map<String, Object> insights(@AuthenticationPrincipal Jwt jwt,
                                        @RequestParam(defaultValue = "all") String range) {
        Number n = jwt.getClaim("uid");
        Long uid = n.longValue();
        LocalDate today = LocalDate.now();
        LocalDate from = "30".equals(range) ? today.minusDays(30)
                : "90".equals(range) ? today.minusDays(90)
                : LocalDate.of(2000, 1, 1);

        List<JobApplication> all = apps.findByUserIdOrderByAppliedOnDescIdDesc(uid);
        List<JobApplication> a = all.stream().filter(x -> !x.getAppliedOn().isBefore(from)).toList();
        List<Interview> iv = interviews.findByUserIdOrderByInterviewAtAsc(uid);

        Map<String, Object> byStatus = new LinkedHashMap<>();
        for (String s : STATUSES) {
            byStatus.put(s, a.stream().filter(x -> s.equals(x.getStatus())).count());
        }

        List<Long> funnel = List.of(
                (long) a.size(),
                count(a, Set.of("Shortlisted", "Interview", "Offer")),
                count(a, Set.of("Interview", "Offer")),
                count(a, Set.of("Offer")));

        YearMonth current = YearMonth.now();
        List<Map<String, Object>> monthly = new ArrayList<>();
        for (int k = 5; k >= 0; k--) {
            YearMonth m = current.minusMonths(k);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("m", m.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            row.put("applied", all.stream().filter(x -> YearMonth.from(x.getAppliedOn()).equals(m)).count());
            row.put("interviews", iv.stream().filter(x -> YearMonth.from(x.getInterviewAt()).equals(m)).count());
            monthly.add(row);
        }

        List<Map<String, Object>> byMode = new ArrayList<>();
        for (String mode : MODES) {
            List<JobApplication> sub = a.stream().filter(x -> mode.equals(x.getWorkMode())).toList();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("mode", mode);
            row.put("applied", (long) sub.size());
            row.put("progressed", count(sub, Set.of("Shortlisted", "Interview", "Offer")));
            byMode.add(row);
        }

        List<Map<String, Object>> byRound = new ArrayList<>();
        for (String round : ROUNDS) {
            List<Interview> sub = iv.stream().filter(x -> round.equals(x.getRoundType())).toList();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("round", round);
            row.put("total", (long) sub.size());
            row.put("done", sub.stream().filter(Interview::isDone).count());
            byRound.add(row);
        }

        LocalDateTime now = LocalDateTime.now();
        List<Interview> open = iv.stream().filter(x -> !x.isDone() && x.getInterviewAt().isAfter(now)).toList();
        int ticks = open.stream().mapToInt(x -> Integer.bitCount(x.getPrepDone() & 15)).sum();
        int prepPercent = open.isEmpty() ? 0 : (int) Math.round(ticks * 100.0 / (open.size() * 4));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", (long) a.size());
        out.put("byStatus", byStatus);
        out.put("funnel", funnel);
        out.put("monthly", monthly);
        out.put("byMode", byMode);
        out.put("byRound", byRound);
        out.put("thisWeek", all.stream().filter(x -> !x.getAppliedOn().isBefore(today.minusDays(6))).count());
        out.put("stale", all.stream().filter(x -> "Applied".equals(x.getStatus()) && !x.getAppliedOn().isAfter(today.minusDays(7))).count());
        out.put("overdue", iv.stream().filter(x -> !x.isDone() && x.getInterviewAt().isBefore(now)).count());
        out.put("upcomingCount", (long) open.size());
        out.put("prepPercent", prepPercent);
        return out;
    }
}