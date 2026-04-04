package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.OrganizationDTOs.OrgRequest;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgResponse;
import com.project.GestionCharite.models.Organization;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.repositories.OrganizationRepository;
import com.project.GestionCharite.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrgResponse createOrganization(OrgRequest request, String managerEmail) {
        // Find the user who is currently logged in
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Organization org = Organization.builder()
                .name(request.getName())
                .legalAddress(request.getLegalAddress())
                .taxIdentificationNumber(request.getTaxIdentificationNumber())
                .primaryContact(request.getPrimaryContact())
                .description(request.getDescription())
                .isValidated(false) // Project Rule: Must be false until a Super-Admin approves
                .manager(manager)
                .build();

        Organization savedOrg = organizationRepository.save(org);
        return mapToResponse(savedOrg);
    }

    public List<OrgResponse> getAllValidatedOrganizations() {
        // Project Rule: Public users should only see validated organizations
        return organizationRepository.findByIsValidatedTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrgResponse mapToResponse(Organization org) {
        return OrgResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .primaryContact(org.getPrimaryContact())
                .isValidated(org.isValidated())
                .managerName(org.getManager().getFirstName() + " " + org.getManager().getLastName())
                .build();
    }
}