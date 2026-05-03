package com.project.GestionCharite.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
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

        BigDecimal newTotal = action.getCurrentAmount().add(request.getAmount());
        action.setCurrentAmount(newTotal);
        actionRepository.save(action);

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

    // 🔒 SECURE METHOD: Get all donations for the logged-in user
    public PageResponse<DonationResponse> getMyDonations(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Page<Donation> donationPage = donationRepository.findByDonorId(user.getId(), pageable);
        List<DonationResponse> content = donationPage.getContent().stream()
                                            .map(this::mapToResponse)
                                            .toList();

        return PageResponse.<DonationResponse>builder()
                .content(content)
                .pageNumber(donationPage.getNumber())
                .pageSize(donationPage.getSize())
                .totalElements(donationPage.getTotalElements())
                .totalPages(donationPage.getTotalPages())
                .isLast(donationPage.isLast())
                .build();
    }

    private DonationResponse mapToResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .amount(donation.getAmount())
                .actionTitle(donation.getAction().getTitle())
                .donorName(donation.getDonor().getFirstName() + " " + donation.getDonor().getLastName())
                .status(donation.getStatus())
                .donationDate(donation.getDonationDate()) 
                .actionid(donation.getAction().getId())
                .message("Thank you for your generous donation!")
                .build();
    }
}