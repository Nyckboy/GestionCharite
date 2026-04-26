package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.UserDTOs.UserProfileUpdateRequest;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 🔒 SECURE: Get logged-in user details
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        // authentication.getName() grabs the email right out of the valid JWT!
        String email = authentication.getName(); 
        return ResponseEntity.ok(userService.getCurrentUserProfile(email));
    }

    // 🔒 SECURE: Update logged-in user details
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            Authentication authentication, 
            @RequestBody UserProfileUpdateRequest request) {
        
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateCurrentUserProfile(email, request));
    }
}