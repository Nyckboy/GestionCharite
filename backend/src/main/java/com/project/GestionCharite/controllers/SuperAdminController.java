package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgResponse;
import com.project.GestionCharite.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final OrganizationService organizationService;

    // 🔒 SECURE: Only SUPER_ADMIN can view pending organizations
    @GetMapping("/organizations/pending")
    public ResponseEntity<PageResponse<OrgResponse>> getPendingOrganizations(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(organizationService.getPendingOrganizations(page, size));
    }

    // 🔒 SECURE: Only SUPER_ADMIN can approve an organization
    @PatchMapping("/organizations/{id}/validate")
    public ResponseEntity<OrgResponse> validateOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.validateOrganization(id));
    }
}