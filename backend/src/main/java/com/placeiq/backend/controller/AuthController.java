package com.placeiq.backend.controller;

import com.placeiq.backend.model.User;
import com.placeiq.backend.repository.UserRepository;
import com.placeiq.backend.service.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public record RegisterRequest(
            @NotBlank String fullName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            return ResponseEntity.status(409).body(Map.of("error", "Email already registered"));
        }
        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(req.password()));
        users.save(user);
        return ResponseEntity.status(201).body(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return users.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "token", jwt.create(u),
                        "fullName", u.getFullName(),
                        "email", u.getEmail())))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid email or password")));
    }
}