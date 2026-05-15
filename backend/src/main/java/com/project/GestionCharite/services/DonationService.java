package com.project.GestionCharite.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.DonationDTOs.DonationRequest;
import com.project.GestionCharite.dto.DonationDTOs.DonationResponse;
import com.project.GestionCharite.dto.DonationDTOs.PaymentIntentResponse;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.Donation;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.models.enums.DonationStatus;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.DonationRepository;
import com.project.GestionCharite.repositories.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final CharityActionRepository actionRepository;
    private final UserRepository userRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;
    

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

    @Transactional
    public PaymentIntentResponse createPaymentIntent(DonationRequest request, String donorEmail) {
        Stripe.apiKey = stripeApiKey;

        User donor = userRepository.findByEmail(donorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        CharityAction action = actionRepository.findById(request.getActionId())
                .orElseThrow(() -> new RuntimeException("Action not found"));

        try {
            // Stripe requires amounts in the smallest currency unit (cents/centimes)
            // e.g., 100 MAD = 10000 centimes
            long amountInCents = request.getAmount().multiply(new BigDecimal("100")).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("mad") // Set to your target currency
                    // Put internal IDs in metadata so the webhook knows what to update!
                    .putMetadata("donorId", donor.getId().toString())
                    .putMetadata("actionId", action.getId().toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Save donation as PENDING. Do NOT add money to the CharityAction yet!
            Donation donation = Donation.builder()
                    .amount(request.getAmount())
                    .donor(donor)
                    .action(action)
                    .status(DonationStatus.PENDING) // 🛠️ Must be PENDING
                    .transactionId(intent.getId())  // 🛠️ Save Stripe's ID
                    .build();

            Donation savedDonation = donationRepository.save(donation);

            return PaymentIntentResponse.builder()
                    .clientSecret(intent.getClientSecret())
                    .donationId(savedDonation.getId())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe Payment Intent: " + e.getMessage());
        }
    }

    // 2. STEP TWO: Fulfill Donation (Called by Stripe Webhook)
    @Transactional
    public void fulfillDonation(String paymentIntentId) {
        // Find the pending donation using the Stripe ID we saved earlier
        Donation donation = donationRepository.findByTransactionId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Donation record not found for intent: " + paymentIntentId));

        // Idempotency check: If Stripe accidentally sends the webhook twice, don't double-charge
        if (donation.getStatus() == DonationStatus.COMPLETED) {
            return;
        }

        // Now we officially update the status and add the money!
        donation.setStatus(DonationStatus.COMPLETED);
        
        CharityAction action = donation.getAction();
        BigDecimal newTotal = action.getCurrentAmount().add(donation.getAmount());
        action.setCurrentAmount(newTotal);

        actionRepository.save(action);
        donationRepository.save(donation);
    }

    public PageResponse<DonationResponse> getDonationsForAction(Long actionId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Donation> donationPage = donationRepository.findByActionId(actionId, pageable);
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