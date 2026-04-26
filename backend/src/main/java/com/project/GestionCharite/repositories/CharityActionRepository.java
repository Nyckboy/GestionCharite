package com.project.GestionCharite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.enums.ActionCategory;

import java.math.BigDecimal;
import java.util.List;


@Repository
public interface CharityActionRepository extends JpaRepository<CharityAction, Long>{
  
  List<CharityAction> findByCategory(ActionCategory category);
  List<CharityAction> findByOrganizationId(Long organizationId);
  List<CharityAction> findByOrganizationManagerId(Long managerId);
  @Query("SELECT COALESCE(SUM(a.currentAmount), 0) FROM CharityAction a")
  BigDecimal sumTotalPlatformRaised();
  // Find actions where the target amount hasn't been reached yet
  // List<CharityAction> findByCurrentAmountLessThanTargetAmount();
}
