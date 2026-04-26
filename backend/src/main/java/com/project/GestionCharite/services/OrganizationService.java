package com.project.GestionCharite.services;

import com.project.GestionCharite.dto.OrganizationDTOs.OrgAdminStatsResponse;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgRequest;
import com.project.GestionCharite.dto.OrganizationDTOs.OrgResponse;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.Organization;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.OrganizationRepository;
import com.project.GestionCharite.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final CharityActionRepository actionRepository;

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

    public List<OrgResponse> getMyOrganizations(String managerEmail) {
        return organizationRepository.findByManagerEmail(managerEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // 🔒 SECURE METHOD: Update an existing organization
    @Transactional
    public OrgResponse updateOrganization(Long id, OrgRequest request, String loggedInUserEmail) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // 🛡️ OWNERSHIP CHECK: Only the manager can edit their organization
        if (!org.getManager().getEmail().equals(loggedInUserEmail)) {
            throw new RuntimeException("Forbidden: You do not own this organization.");
        }

        // Update the fields
        org.setName(request.getName());
        org.setLegalAddress(request.getLegalAddress());
        org.setTaxIdentificationNumber(request.getTaxIdentificationNumber());
        org.setPrimaryContact(request.getPrimaryContact());
        org.setDescription(request.getDescription());
        
        // Note: We intentionally DO NOT change the isValidated status here.
        // It keeps its current approval status.

        Organization updatedOrg = organizationRepository.save(org);
        return mapToResponse(updatedOrg);
    }

    // 🔒 SECURE METHOD: Delete an organization (Smart Delete)
    @Transactional
    public void deleteOrganization(Long id, String loggedInUserEmail) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // 🛡️ OWNERSHIP CHECK
        if (!org.getManager().getEmail().equals(loggedInUserEmail)) {
            throw new RuntimeException("Forbidden: You do not own this organization.");
        }

        // 🛑 INTEGRITY PROTECTION CHECK: Does this org have campaigns?
        // (Assuming you have CharityActionRepository injected)
        boolean hasActiveCampaigns = !actionRepository.findByOrganizationId(id).isEmpty();
        if (hasActiveCampaigns) {
            throw new RuntimeException("Cannot delete this organization. It has linked charity campaigns. Please delete or close all campaigns first.");
        }

        organizationRepository.delete(org);
    }

    // 🌍 PUBLIC METHOD: Fetch a single organization's details by ID
    public OrgResponse getOrganizationById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return mapToResponse(org);
    }

    // --------------------------------------------------------
    // SUPER-ADMIN METHODS
    // --------------------------------------------------------

    public List<OrgResponse> getPendingOrganizations() {
        // Fetches all organizations where isValidated is false
        return organizationRepository.findByIsValidatedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrgResponse validateOrganization(Long id) {
        // Find the organization by ID
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // Flip the switch
        org.setValidated(true); 
        
        // Save back to the database
        Organization updatedOrg = organizationRepository.save(org);
        
        return mapToResponse(updatedOrg);
    }

    // 🔒 SECURE: Get statistics for the logged-in ORG_ADMIN
    public OrgAdminStatsResponse getMyOrgStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Get total orgs
        long totalOrgs = organizationRepository.findByManagerId(user.getId()).size();

        // 2. Get all campaigns belonging to those orgs
        List<CharityAction> myCampaigns = actionRepository.findByOrganizationManagerId(user.getId());
        long totalCampaigns = myCampaigns.size();

        // 3. Safely sum the currentAmount across all campaigns
        BigDecimal totalRaised = myCampaigns.stream()
                .map(action -> action.getCurrentAmount() != null ? action.getCurrentAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrgAdminStatsResponse.builder()
                .totalOrganizations(totalOrgs)
                .totalCampaigns(totalCampaigns)
                .totalRaised(totalRaised)
                .build();
    }

    private OrgResponse mapToResponse(Organization org) {
        return OrgResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .primaryContact(org.getPrimaryContact())
                .isValidated(org.isValidated())
                .managerName(org.getManager().getFirstName() + " " + org.getManager().getLastName())
                .taxIdentificationNumber(org.getTaxIdentificationNumber())
                .legalAddress(org.getLegalAddress())
                .description(org.getDescription())
                .build();
    }
}