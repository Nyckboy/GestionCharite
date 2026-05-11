package com.project.GestionCharite.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.project.GestionCharite.models.ActionUpdate;
import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.models.enums.DonationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String longStory; 
    private List<ActionUpdate> updates; 
    private LocalDate actionDate;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private ActionCategory category;
    private String location;
    private Long organizationId;
    private String organizationName; // Just the name, not the whole Org object
    private String mediaUrl; // Optional: URL from Supabase Storage
    private boolean isArchived;
  } 

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class UpdateRequest {
      private String message;
  }

  // // --- DONATION DTOs ---

  // @Data @Builder
  // public static class DonationRequest {
  //   private BigDecimal amount;
  //   private Long actionId;
  // }

  // @Data @Builder
  // public static class DonationResponse {
  //   private Long id;
  //   private BigDecimal amount;
  //   private String actionTitle;
  //   private DonationStatus status;
  //   private LocalDateTime donationDate;
  // }
}
