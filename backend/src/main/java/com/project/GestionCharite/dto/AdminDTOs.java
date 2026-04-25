package com.project.GestionCharite.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AdminDTOs {

	@Data
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class AdminStatsResponse {
		private long totalOrganizations;
		private long pendingApprovals;
		private long totalCampaigns;
		private BigDecimal totalRaised;
		private long totalUsers;
	}
}
