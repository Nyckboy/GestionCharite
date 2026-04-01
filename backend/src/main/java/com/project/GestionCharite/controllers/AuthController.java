package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.AuthDTOs.AuthRequest;
import com.project.GestionCharite.dto.AuthDTOs.AuthResponse;
import com.project.GestionCharite.dto.AuthDTOs.RegisterRequest;
import com.project.GestionCharite.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
