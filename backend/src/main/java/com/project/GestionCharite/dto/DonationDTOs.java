package com.project.GestionCharite.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.project.GestionCharite.models.enums.DonationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class DonationDTOs {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DonationRequest {
        private BigDecimal amount;
        private Long actionId; // The ID of the campaign they are donating to
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DonationResponse {
        private Long id;
        private BigDecimal amount;
        private String actionTitle;
        private String donorName;
        private DonationStatus status;
        private LocalDateTime donationDate;
        private String message;
    }
}