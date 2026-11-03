package com.placeiq.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/api/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        Object id = jwt.getClaim("uid");
        return Map.of(
                "id", id,
                "email", jwt.getSubject(),
                "fullName", jwt.getClaimAsString("name"));
    }
}