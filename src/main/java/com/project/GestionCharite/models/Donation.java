package com.project.GestionCharite.models;

import jakarta.persistence.*;
import lombok.*;
import com.project.GestionCharite.models.enums.DonationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private BigDecimal amount;

  // Links the donation to the user who made it
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "donor_id", nullable = false)
  private User donor;

  // Links the donation to the specific charity action
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "action_id", nullable = false)
  private CharityAction action;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private DonationStatus status;

  // To store the ID returned by Stripe/PayPal for reference
  private String transactionId; 

  @Column(updatable = false)
  private LocalDateTime donationDate;

  @PrePersist
  protected void onCreate() {
      this.donationDate = LocalDateTime.now();
  }
}
