package com.project.GestionCharite.controllers;

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

    // 🌍 PUBLIC: Anyone can view the list of validated organizations
    @GetMapping
    public ResponseEntity<List<OrgResponse>> getValidatedOrganizations() {
        return ResponseEntity.ok(organizationService.getAllValidatedOrganizations());
    }
}