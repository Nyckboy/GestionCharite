package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.AdminDTOs.AdminStatsResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.UserDTOs.UserCreateRequest;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.dto.UserDTOs.UserUpdateRequest;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.models.enums.AuthProvider;
import com.project.GestionCharite.models.enums.Role;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.DonationRepository;
import com.project.GestionCharite.repositories.OrganizationRepository;
import com.project.GestionCharite.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final DonationRepository donationRepository;

    // Add this to your injected dependencies at the top of AdminService:
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

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
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);
        List<UserResponse> content = userPage.getContent().stream()
                                        .map(this::mapUserToResponse)
                                        .toList(); 


        return PageResponse.<UserResponse>builder()
                    .content(content)
                    .pageNumber(userPage.getNumber())
                    .pageSize(userPage.getSize())
                    .totalElements(userPage.getTotalElements())
                    .totalPages(userPage.getTotalPages())
                    .isLast(userPage.isLast())
                    .build();
    }

    public PageResponse<ActionResponse> getAllActionsGlobally(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CharityAction> actionPage = actionRepository.findAll(pageable);
        List<ActionResponse> content = actionPage.getContent().stream()
                                        .map(actionService::mapToResponse)
                                        .toList();
        
        return PageResponse.<ActionResponse>builder()
                    .content(content)
                    .pageNumber(actionPage.getNumber())
                    .pageSize(actionPage.getSize())
                    .totalElements(actionPage.getTotalElements())
                    .totalPages(actionPage.getTotalPages())
                    .isLast(actionPage.isLast())
                    .build();
    }

    // // 3. Global Campaign Management
    // public List<ActionResponse> getAllCampaignsGlobally() {
    //     // Reusing your existing mapping logic from CharityActionService
    //     return actionRepository.findAll().stream()
    //             .map(actionService::mapToResponse) 
    //             .collect(Collectors.toList());
    // }

    // 1. GET SINGLE USER
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToResponse(user);
    }

    // 2. CREATE USER
    public UserResponse createUser(UserCreateRequest request) {
        // Check if email is already taken
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .authProvider(AuthProvider.LOCAL)
                .build();

        User savedUser = userRepository.save(user);
        return mapUserToResponse(savedUser);
    }

    // 3. UPDATE USER
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(Role.valueOf(request.getRole()));

        User updatedUser = userRepository.save(user);
        return mapUserToResponse(updatedUser);
    }

    // 4. SMART DELETE USER
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🛑 INTEGRITY CHECK: Does this user manage any organizations?
        // (Assuming your Organization entity has a getManager() method)
        boolean managesOrganizations = !organizationRepository.findAll().stream()
                .filter(org -> org.getManager().getId().equals(id))
                .toList().isEmpty();

        if (managesOrganizations) {
            throw new RuntimeException("Cannot delete user: They are the manager of an organization. Transfer ownership or delete the organization first.");
        }

        // 🛑 INTEGRITY CHECK 2: Has this user made any financial donations?
        // 🛠️ THE FIX: Use findByDonorId here!
        boolean hasMadeDonations = !donationRepository.findByDonorId(id).isEmpty();
        
        if (hasMadeDonations) {
            throw new RuntimeException("Cannot delete user: This account has a recorded financial donation history. Please disable or ban the account instead of deleting it.");
        }
        userRepository.delete(user);
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