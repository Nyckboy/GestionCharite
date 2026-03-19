package com.project.GestionCharite.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.models.enums.DonationStatus;

import lombok.Builder;
import lombok.Data;

public class CharityDTOs {
  // --- CHARITY ACTION DTOs ---
  @Data @Builder
  public static class ActionRequest {
    private String title;
    private String description;
    private LocalDate actionDate;
    private String location;
    private BigDecimal targetAmount;
    private ActionCategory category;
    private Long organizationId;
    private String mediaUrl; // Optional: URL from Supabase Storage
  }

  @Data @Builder
  public static class ActionResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate actionDate;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private ActionCategory category;
    private String organizationName; // Just the name, not the whole Org object
  } 

  // --- DONATION DTOs ---

  @Data @Builder
  public static class DonationRequest {
    private BigDecimal amount;
    private Long actionId;
  }

  @Data @Builder
  public static class DonationResponse {
    private Long id;
    private BigDecimal amount;
    private String actionTitle;
    private DonationStatus status;
    private LocalDateTime donationDate;
  }
}
