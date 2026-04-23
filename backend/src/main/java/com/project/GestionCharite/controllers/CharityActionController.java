package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.CharityDTOs.ActionRequest;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.dto.CharityDTOs.UpdateRequest;
import com.project.GestionCharite.models.ActionUpdate;
import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.services.CharityActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/actions")
@RequiredArgsConstructor
public class CharityActionController {

    private final CharityActionService actionService;

    // 🔒 SECURE: Requires a valid JWT token and an ORG_ADMIN or SUPER_ADMIN role
    @PostMapping
    public ResponseEntity<ActionResponse> createAction(@RequestBody ActionRequest request, Authentication authentication) {

        String loggedInUserEmail = authentication.getName();

        return ResponseEntity.status(HttpStatus.CREATED).body(actionService.createAction(request, loggedInUserEmail));
    }

    // 🌍 PUBLIC: View all actions
    @GetMapping
    public ResponseEntity<List<ActionResponse>> getAllActions() {
        return ResponseEntity.ok(actionService.getAllActions());
    }

    // 🌍 PUBLIC: Anyone can view actions, no token required
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ActionResponse>> getActionsByCategory(@PathVariable ActionCategory category) {
        return ResponseEntity.ok(actionService.getActionsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActionResponse> getActionById(@PathVariable Long id) {
        return ResponseEntity.ok(actionService.getActionById(id));
    }

    // 🌍 PUBLIC: Anyone can view the actions of a specific organization
    @GetMapping("/organization/{id}")
    public ResponseEntity<List<ActionResponse>> getActionsByOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(actionService.getActionsByOrganization(id));
    }

    // 🔒 SECURE: Only the ORG_ADMIN who owns the action can post an update
    @PostMapping("/{actionId}/updates")
    public ResponseEntity<ActionUpdate> postUpdate(
            @PathVariable Long actionId,
            @RequestBody UpdateRequest request,
            Authentication authentication) {
        
        String loggedInUserEmail = authentication.getName();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(actionService.addUpdateToAction(actionId, request, loggedInUserEmail));
    }
}