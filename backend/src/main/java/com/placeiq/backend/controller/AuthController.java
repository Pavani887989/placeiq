package com.placeiq.backend.controller;

import com.placeiq.backend.model.User;
import com.placeiq.backend.repository.UserRepository;
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

    public AuthController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public record RegisterRequest(
            @NotBlank String fullName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8) String password) {
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
}