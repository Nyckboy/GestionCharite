package com.project.GestionCharite.models;

import jakarta.persistence.*;
import lombok.*;
import com.project.GestionCharite.models.enums.ActionCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "charity_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharityAction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String description;

  @Column(nullable = false)
  private LocalDate actionDate;

  @Column(nullable = false)
  private String location;

  @Column(nullable = false)
  private BigDecimal targetAmount;

  @Column(nullable = false)
  @Builder.Default
  private BigDecimal currentAmount = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ActionCategory category;

  // We will store the Supabase Storage URL here for the imported media
  private String mediaUrl;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organization_id", nullable = false)
  private Organization organization;

  @Column(updatable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
      this.createdAt = LocalDateTime.now();
  }
}
