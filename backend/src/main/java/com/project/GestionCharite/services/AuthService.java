package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.AuthDTOs.AuthRequest;
import com.project.GestionCharite.dto.AuthDTOs.AuthResponse;
import com.project.GestionCharite.dto.AuthDTOs.RegisterRequest;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.models.enums.AuthProvider;
import com.project.GestionCharite.models.enums.Role;
import com.project.GestionCharite.repositories.UserRepository;
import com.project.GestionCharite.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = request.getRole() != null && request.getRole().equalsIgnoreCase("ORG_ADMIN") 
                ? Role.ORG_ADMIN 
                : Role.USER;

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .authProvider(AuthProvider.LOCAL)
                .build();
                
        repository.save(user);
        
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
                
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .build();
    }
}