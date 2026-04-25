package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.AdminDTOs.AdminStatsResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.OrganizationRepository;
import com.project.GestionCharite.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final CharityActionRepository actionRepository;
    private final CharityActionService actionService; // To reuse your existing mapToResponse

    // 1. Platform Statistics
    public AdminStatsResponse getPlatformStats() {
        return AdminStatsResponse.builder()
                .totalOrganizations(organizationRepository.count())
                .pendingApprovals(organizationRepository.countByIsValidatedFalse())
                .totalCampaigns(actionRepository.count())
                .totalRaised(actionRepository.sumTotalPlatformRaised())
                .totalUsers(userRepository.count())
                .build();
    }

    // 2. User Management
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
    }

    // 3. Global Campaign Management
    public List<ActionResponse> getAllCampaignsGlobally() {
        // Reusing your existing mapping logic from CharityActionService
        return actionRepository.findAll().stream()
                .map(actionService::mapToResponse) 
                .collect(Collectors.toList());
    }

    // Helper mapping method for Users
    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name()) 
                .build();
    }
}