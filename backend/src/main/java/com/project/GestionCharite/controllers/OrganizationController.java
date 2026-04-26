package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.OrganizationDTOs.OrgAdminStatsResponse;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgRequest;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgResponse;
import com.project.GestionCharite.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    // 🔒 SECURE: Any logged-in user can request to register an organization
    @PostMapping
    public ResponseEntity<OrgResponse> createOrganization(
            @RequestBody OrgRequest request,
            Authentication authentication) {
        
        // Extract the email of the person who sent the token
        String managerEmail = authentication.getName();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(organizationService.createOrganization(request, managerEmail));
    }

    // 🔒 SECURE: Logged-in managers can fetch their own organizations
    @GetMapping("/my-orgs")
    public ResponseEntity<List<OrgResponse>> getMyOrganizations(Authentication authentication) {
        // Extract the email directly from the secure token
        String managerEmail = authentication.getName();
        
        return ResponseEntity.ok(organizationService.getMyOrganizations(managerEmail));
    }


    // 🔒 SECURE: Edit/Update an existing organization
    @PutMapping("/{id}")
    public ResponseEntity<OrgResponse> updateOrganization(
            @PathVariable Long id,
            @RequestBody OrgRequest request,
            Authentication authentication) {
        
        String loggedInUserEmail = authentication.getName();
        return ResponseEntity.ok(organizationService.updateOrganization(id, request, loggedInUserEmail));
    }

    // 🔒 SECURE: Delete an organization (if it has no campaigns)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrganization(
            @PathVariable Long id,
            Authentication authentication) {
        
        String loggedInUserEmail = authentication.getName();
        
        try {
            organizationService.deleteOrganization(id, loggedInUserEmail);
            return ResponseEntity.ok("Organization successfully deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 🔒 SECURE: Get stats for ORG_ADMIN dashboard
    @GetMapping("/me/stats")
    public ResponseEntity<OrgAdminStatsResponse> getMyOrgStats(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(organizationService.getMyOrgStats(email));
    }

    // 🌍 PUBLIC: Anyone can view the list of validated organizations
    @GetMapping
    public ResponseEntity<List<OrgResponse>> getValidatedOrganizations() {
        return ResponseEntity.ok(organizationService.getAllValidatedOrganizations());
    }

    // 🌍 PUBLIC: Get details of a specific organization by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrgResponse> getOrganizationById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getOrganizationById(id));
    }
}