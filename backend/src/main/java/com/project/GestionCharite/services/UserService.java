package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.UserDTOs.UserProfileUpdateRequest;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 🔒 SECURE: Get current user profile
    public UserResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToResponse(user);
    }

    // 🔒 SECURE: Update current user profile
    @Transactional
    public UserResponse updateCurrentUserProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only update the safe fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User updatedUser = userRepository.save(user);
        return mapUserToResponse(updatedUser);
    }

    // Helper mapping method (copied from AdminService to keep things independent)
    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "USER")
                .build();
    }
}