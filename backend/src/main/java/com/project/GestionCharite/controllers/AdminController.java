package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.AdminDTOs.AdminStatsResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 🔒 SECURE: Global Campaign Management (SUPER_ADMIN only)
    @GetMapping("/actions/all")
    public ResponseEntity<List<ActionResponse>> getAllGlobalActions() {
        return ResponseEntity.ok(adminService.getAllCampaignsGlobally());
    }
}