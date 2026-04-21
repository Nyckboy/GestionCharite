package com.project.GestionCharite.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.CharityDTOs.ActionRequest;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.Organization;
import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.OrganizationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CharityActionService {
  private final CharityActionRepository actionRepository;
  private final OrganizationRepository organizationRepository;

  @Transactional
  public ActionResponse createAction(ActionRequest request, String loggedInUserEmail) {
    Organization org = organizationRepository.findById(request.getOrganizationId()).orElseThrow(() -> new RuntimeException("Organization not found"));

    // Business Rule: Only validated organizations can create actions
    if (!org.isValidated()) {
      throw new IllegalStateException("Organization must be validated by a super-admin to create actions.");
    }

    // THE OWNERSHIP CHECK: Are you actually the manager of this org?
    if (!org.getManager().getEmail().equals(loggedInUserEmail)) {
        throw new RuntimeException("Stop right there! You do not own this organization.");
    }

    CharityAction action = CharityAction.builder()
                            .title(request.getTitle())
                            .description(request.getDescription())
                            .actionDate(request.getActionDate())
                            .location(request.getLocation())
                            .targetAmount(request.getTargetAmount())
                            .category(request.getCategory())
                            .mediaUrl(request.getMediaUrl())
                            .organization(org)
                            .build();

    CharityAction savedAction = actionRepository.save(action);
    return mapToResponse(savedAction);
  }
  
  public List<ActionResponse> getActionsByCategory(ActionCategory category) {
    return actionRepository.findByCategory(category).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
  }

  // 🌍 PUBLIC METHOD: Fetch all actions for a specific organization
    public List<ActionResponse> getActionsByOrganization(Long organizationId) {
        return actionRepository.findByOrganizationId(organizationId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
  }
  // 🌍 PUBLIC METHOD: Fetch absolutely all campaigns for the homepage
    public List<ActionResponse> getAllActions() {
        return actionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
  }

  private ActionResponse mapToResponse(CharityAction action) {
    return ActionResponse.builder()
            .id(action.getId())
            .title(action.getTitle())
            .description(action.getDescription())
            .actionDate(action.getActionDate())
            .targetAmount(action.getTargetAmount())
            .currentAmount(action.getCurrentAmount())
            .category(action.getCategory())
            .organizationName(action.getOrganization().getName())
            .build();
  }
}
