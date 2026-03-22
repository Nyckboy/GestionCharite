package com.project.GestionCharite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.GestionCharite.models.CharityAction;
import com.project.GestionCharite.models.enums.ActionCategory;
import java.util.List;


@Repository
public interface CharityActionRepository extends JpaRepository<CharityAction, Long>{
  
  List<CharityAction> findByCategory(ActionCategory category);
  List<CharityAction> findByOrganizationId(Long organizationId);
  // Find actions where the target amount hasn't been reached yet
  // List<CharityAction> findByCurrentAmountLessThanTargetAmount();
}
