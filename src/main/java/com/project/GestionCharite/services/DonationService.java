package com.project.GestionCharite.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.CharityDTOs.DonationRequest;
import com.project.GestionCharite.dto.CharityDTOs.DonationResponse;
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
  public DonationResponse processDonation(DonationRequest request, Long donorId) {
      User donor = userRepository.findById(donorId)
              .orElseThrow(() -> new RuntimeException("User not found"));

      CharityAction action = actionRepository.findById(request.getActionId())
              .orElseThrow(() -> new RuntimeException("Charity Action not found"));

      // 1. Create the Donation record
      Donation donation = Donation.builder()
              .amount(request.getAmount())
              .donor(donor)
              .action(action)
              .status(DonationStatus.COMPLETED) // Assuming success for now; we'd update this when integrating Stripe 
              .build();

      Donation savedDonation = donationRepository.save(donation);

      // 2. Update the Charity Action's current progress 
      action.setCurrentAmount(action.getCurrentAmount().add(request.getAmount()));
      actionRepository.save(action);

      return DonationResponse.builder()
              .id(savedDonation.getId())
              .amount(savedDonation.getAmount())
              .actionTitle(action.getTitle())
              .status(savedDonation.getStatus())
              .donationDate(savedDonation.getDonationDate())
              .build();
  }
}