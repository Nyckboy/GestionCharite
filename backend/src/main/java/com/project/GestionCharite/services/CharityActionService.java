package com.project.GestionCharite.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.GestionCharite.dto.PageResponse;
import com.project.GestionCharite.dto.UserDTOs.UserResponse;
import com.project.GestionCharite.dto.CharityDTOs.ActionRequest;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.CharityDTOs.UpdateRequest;
import com.project.GestionCharite.models.ActionUpdate;
import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.Organization;
import com.project.GestionCharite.models.User;
import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.repositories.CharityActionRepository;
import com.project.GestionCharite.repositories.OrganizationRepository;
import com.project.GestionCharite.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CharityActionService {
    private final CharityActionRepository actionRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;


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

    // 🌍 PUBLIC METHOD: Fetch all actions for a specific organization
    public List<ActionResponse> getActionsByOrganization(Long organizationId) {
            return actionRepository.findByOrganizationId(organizationId)
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
    }

    public PageResponse<ActionResponse> getActionsByCategory(ActionCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CharityAction> actionPage = actionRepository.findByCategoryAndIsArchivedFalse(category, pageable);
        List<ActionResponse> content = actionPage.getContent().stream()
                                        .map(this::mapToResponse)
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

  // 🌍 PUBLIC METHOD: Fetch absolutely all campaigns for the homepage
    public PageResponse<ActionResponse> getAllActions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CharityAction> actionPage = actionRepository.findAllByIsArchivedFalse(pageable);
        List<ActionResponse> content = actionPage.getContent().stream()
                                        .map(this::mapToResponse)
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

  // 🔒 SECURE METHOD: Update an existing campaign
  @Transactional
  public ActionResponse updateAction(Long actionId, ActionRequest request, String loggedInUserEmail) {
      CharityAction action = actionRepository.findById(actionId)
              .orElseThrow(() -> new RuntimeException("Charity Action not found"));

      // 🛡️ OWNERSHIP CHECK
      if (!action.getOrganization().getManager().getEmail().equals(loggedInUserEmail)) {
          throw new RuntimeException("Forbidden: You do not own the organization running this campaign.");
      }

      // Update the fields
      action.setTitle(request.getTitle());
      action.setDescription(request.getDescription());
      action.setActionDate(request.getActionDate());
      action.setLocation(request.getLocation());
      action.setTargetAmount(request.getTargetAmount());
      action.setCategory(request.getCategory());
      action.setMediaUrl(request.getMediaUrl());
      
      CharityAction updatedAction = actionRepository.save(action);
      return mapToResponse(updatedAction);
  }

  // 🔒 SECURE METHOD: Delete a campaign (Smart Delete)
  @Transactional
  public void deleteAction(Long actionId, String loggedInUserEmail) {
      CharityAction action = actionRepository.findById(actionId)
              .orElseThrow(() -> new RuntimeException("Charity Action not found"));

      // 🛡️ OWNERSHIP CHECK
      if (!action.getOrganization().getManager().getEmail().equals(loggedInUserEmail)) {
          throw new RuntimeException("Forbidden: You do not own the organization running this campaign.");
      }

      // 💰 FINANCIAL PROTECTION CHECK
      if (action.getCurrentAmount().compareTo(BigDecimal.ZERO) > 0) {
          throw new RuntimeException("Cannot delete a campaign that has already received donations. Please close the campaign instead.");
      }

      actionRepository.delete(action);
  }

  // 🔒 SECURE: Get all campaigns for the logged-in ORG_ADMIN
  public List<ActionResponse> getMyCampaigns(String email) {
      User user = userRepository.findByEmail(email)
              .orElseThrow(() -> new RuntimeException("User not found"));

      return actionRepository.findByOrganizationManagerId(user.getId())
              .stream()
              .map(this::mapToResponse) // Your existing public mapper!
              .collect(Collectors.toList());
  }

    // 🔒 SECURE: Archive a campaign (Soft Delete)
    public ActionResponse archiveCampaign(Long id) {
        CharityAction action = actionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // Toggle the status to true
        action.setArchived(true);
        
        // Save and return the updated DTO
        CharityAction savedAction = actionRepository.save(action);
        return mapToResponse(savedAction);
    }

    // 🔒 SECURE: Unarchive a campaign (Restore)
    public ActionResponse unarchiveCampaign(Long id) {
        CharityAction action = actionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // Toggle the status back to false (active)
        action.setArchived(false);
        
        // Save and return the restored DTO
        CharityAction savedAction = actionRepository.save(action);
        return mapToResponse(savedAction);
    }

    public ActionResponse mapToResponse(CharityAction action) {
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
                .organizationId(action.getOrganization().getId())
                .location(action.getLocation())
                .mediaUrl(action.getMediaUrl())
                .isArchived(action.isArchived())
                .build();
    }
}
