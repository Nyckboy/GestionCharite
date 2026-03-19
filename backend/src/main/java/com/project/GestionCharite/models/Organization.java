package com.project.GestionCharite.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;  

  @Column(nullable = false, unique = true)
  private String name;

  @Column(nullable = false)
  private String legalAddress;

  @Column(nullable = false, unique = true)
  private String taxIdentificationNumber; // Numero d'identification fiscale

  @Column(nullable = false)
  private String primaryContact;

  @Column(columnDefinition = "TEXT")
  private String description;

  // We will store the Supabase Storage URL here later
  private String logoUrl;

  // Requires manual approval by a Super-Admin
  @Column(nullable = false)
  @Builder.Default
  private boolean isValidated = false;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "manager_id", nullable = false)
  private User manager;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void oncreate(){
    this.createdAt = LocalDateTime.now();
  }
}
