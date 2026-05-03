package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.AdminDTOs.AdminStatsResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.UserDTOs.UserCreateRequest;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.dto.UserDTOs.UserUpdateRequest;
import com.project.GestionCharite.services.AdminService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // 🔒 SECURE: Platform Statistics (SUPER_ADMIN only)
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    // 🔒 SECURE: User Management (SUPER_ADMIN only)
    @GetMapping("/users")
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    // 🔒 SECURE: Global Campaign Management (SUPER_ADMIN only)
    @GetMapping("/actions/all")
    public ResponseEntity<List<ActionResponse>> getAllGlobalActions() {
        return ResponseEntity.ok(adminService.getAllCampaignsGlobally());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    // 2. CREATE USER
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        try {
            // If it works, send the 201 Created and the new user
            return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createUser(request));
        } catch (RuntimeException e) {
            // 🛠️ THE FIX: If the email exists (or another error happens), catch it and send a 400!
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 3. UPDATE USER
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    // 4. DELETE USER (Smart Delete)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok("User successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}