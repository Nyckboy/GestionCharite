package com.project.GestionCharite.services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.CharityDTOs.ActionRequest;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.CharityDTOs.UpdateRequest;
import com.project.GestionCharite.models.ActionUpdate;
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
  // 🌍 PUBLIC METHOD: Fetch a single action's details by ID
  public ActionResponse getActionById(Long id) {
        CharityAction action = actionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Charity Action not found"));
        return mapToResponse(action);
  }

  // 🔒 SECURE METHOD: Post a new update to a campaign
    @Transactional
  public ActionUpdate addUpdateToAction(Long actionId, UpdateRequest request, String loggedInUserEmail) {
    
    CharityAction action = actionRepository.findById(actionId)
            .orElseThrow(() -> new RuntimeException("Charity Action not found"));

    // 🛡️ THE OWNERSHIP CHECK: Are you the manager of the org running this campaign?
    if (!action.getOrganization().getManager().getEmail().equals(loggedInUserEmail)) {
        throw new RuntimeException("Forbidden: You do not own the organization running this campaign.");
    }

    // Create the new update with today's date automatically
    ActionUpdate newUpdate = new ActionUpdate(LocalDate.now(), request.getMessage());

    // Add it to the list and save the action
    action.getUpdates().add(newUpdate);
    actionRepository.save(action);

    return newUpdate; 
  }

  private ActionResponse mapToResponse(CharityAction action) {
    return ActionResponse.builder()
            .id(action.getId())
            .title(action.getTitle())
            .description(action.getDescription())
            .longStory(action.getLongStory())
            .updates(action.getUpdates())
            .actionDate(action.getActionDate())
            .targetAmount(action.getTargetAmount())
            .currentAmount(action.getCurrentAmount())
            .category(action.getCategory())
            .organizationName(action.getOrganization().getName())
            .build();
  }
}
