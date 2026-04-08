package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.DonationDTOs.DonationRequest;
import com.project.GestionCharite.dto.DonationDTOs.DonationResponse;
import com.project.GestionCharite.services.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    // 🔒 SECURE: Any logged-in user can make a donation
    @PostMapping
    public ResponseEntity<DonationResponse> makeDonation(
            @RequestBody DonationRequest request,
            Authentication authentication) {
        
        // Spring Security automatically extracts the email from the JWT token!
        String donorEmail = authentication.getName();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.makeDonation(request, donorEmail));
    }

    // 🌍 PUBLIC: Anyone can view the list of donations for a specific campaign
    @GetMapping("/action/{actionId}")
    public ResponseEntity<List<DonationResponse>> getDonationsForAction(@PathVariable Long actionId) {
        return ResponseEntity.ok(donationService.getDonationsForAction(actionId));
    }
}