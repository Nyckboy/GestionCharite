package com.project.GestionCharite.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.DonationDTOs.DonationRequest;
import com.project.GestionCharite.dto.DonationDTOs.DonationResponse;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.Donation;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.models.enums.DonationStatus;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.DonationRepository;
import com.project.GestionCharite.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final CharityActionRepository actionRepository;
    private final UserRepository userRepository;

    @Transactional
    public DonationResponse makeDonation(DonationRequest request, String donorEmail) {
        // 1. Find the User making the donation
        User donor = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the Charity Action they are donating to
        CharityAction action = actionRepository.findById(request.getActionId())
                .orElseThrow(() -> new RuntimeException("Charity Action not found"));

        // 3. Build and save the Donation
        Donation donation = Donation.builder()
                .amount(request.getAmount())
                .donationDate(LocalDateTime.now())
                .donor(donor)
                .action(action)
                .status(DonationStatus.COMPLETED) 
                .build();

        Donation savedDonation = donationRepository.save(donation);

        return mapToResponse(savedDonation);
    }

    public List<DonationResponse> getDonationsForAction(Long actionId) {
        return donationRepository.findByActionId(actionId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DonationResponse mapToResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .amount(donation.getAmount())
                .actionTitle(donation.getAction().getTitle())
                .donorName(donation.getDonor().getFirstName() + " " + donation.getDonor().getLastName())
                .status(donation.getStatus())
                .donationDate(donation.getDonationDate()) 
                .message("Thank you for your generous donation!")
                .build();
    }
}