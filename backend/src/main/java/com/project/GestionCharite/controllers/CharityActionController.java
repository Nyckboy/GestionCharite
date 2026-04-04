package com.project.GestionCharite.controllers;

import com.project.GestionCharite.dto.CharityDTOs.ActionRequest;
import com.project.GestionCharite.dto.CharityDTOs.ActionResponse;
import com.project.GestionCharite.models.enums.ActionCategory;
import com.project.GestionCharite.services.CharityActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/actions")
@RequiredArgsConstructor
public class CharityActionController {

    private final CharityActionService actionService;

    // 🔒 SECURE: Requires a valid JWT token and an ORG_ADMIN or SUPER_ADMIN role
    @PostMapping
    public ResponseEntity<ActionResponse> createAction(@RequestBody ActionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actionService.createAction(request));
    }

    // 🌍 PUBLIC: Anyone can view actions, no token required
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ActionResponse>> getActionsByCategory(@PathVariable ActionCategory category) {
        return ResponseEntity.ok(actionService.getActionsByCategory(category));
    }
}