package com.placeiq.backend.controller;

import com.placeiq.backend.model.Interview;
import com.placeiq.backend.model.JobApplication;
import com.placeiq.backend.repository.InterviewRepository;
import com.placeiq.backend.repository.JobApplicationRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private static final List<String> STATUSES = List.of("Applied", "Shortlisted", "Interview", "Offer", "Rejected");

    private final JobApplicationRepository apps;
    private final InterviewRepository interviews;

    public StatsController(JobApplicationRepository apps, InterviewRepository interviews) {
        this.apps = apps;
        this.interviews = interviews;
    }

    @GetMapping
    public Map<String, Object> stats(@AuthenticationPrincipal Jwt jwt) {
        Number n = jwt.getClaim("uid");
        Long uid = n.longValue();
        List<JobApplication> a = apps.findByUserIdOrderByAppliedOnDescIdDesc(uid);
        List<Interview> iv = interviews.findByUserIdOrderByInterviewAtAsc(uid);

        Map<String, Object> byStatus = new LinkedHashMap<>();
        for (String s : STATUSES) {
            byStatus.put(s, a.stream().filter(x -> s.equals(x.getStatus())).count());
        }

        YearMonth current = YearMonth.now();
        List<Map<String, Object>> monthly = new ArrayList<>();
        for (int k = 5; k >= 0; k--) {
            YearMonth m = current.minusMonths(k);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("m", m.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            row.put("applied", a.stream().filter(x -> YearMonth.from(x.getAppliedOn()).equals(m)).count());
            row.put("interviews", iv.stream().filter(x -> YearMonth.from(x.getInterviewAt()).equals(m)).count());
            monthly.add(row);
        }

        LocalDateTime now = LocalDateTime.now();
        List<Interview> open = iv.stream().filter(x -> !x.isDone() && x.getInterviewAt().isAfter(now)).toList();
        int ticks = open.stream().mapToInt(x -> Integer.bitCount(x.getPrepDone() & 15)).sum();
        int prepPercent = open.isEmpty() ? 0 : (int) Math.round(ticks * 100.0 / (open.size() * 4));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", (long) a.size());
        out.put("thisMonth", a.stream().filter(x -> YearMonth.from(x.getAppliedOn()).equals(current)).count());
        out.put("byStatus", byStatus);
        out.put("monthly", monthly);
        out.put("interviewsTotal", (long) iv.size());
        out.put("interviewsDone", iv.stream().filter(Interview::isDone).count());
        out.put("upcomingCount", (long) open.size());
        out.put("prepPercent", prepPercent);
        out.put("upcoming", open.stream().limit(3).toList());
        out.put("recent", a.stream().limit(5).toList());
        return out;
    }
}