package com.project.GestionCharite.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.project.GestionCharite.models.enums.*;;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nom;

  @Column(unique = true, nullable = false)
  private String email;

  private String mdp;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AuthProvider authProvider;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate(){
    this.createdAt = LocalDateTime.now();
  }
}
