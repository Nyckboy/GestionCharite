package com.project.GestionCharite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class OrganizationDTOs {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrgRequest {
        private String name;
        private String legalAddress;
        private String taxIdentificationNumber;
        private String primaryContact;
        private String description;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrgResponse {
        private Long id;
        private String name;
        private String primaryContact;
        private boolean isValidated;
        private String managerName;
    }
}