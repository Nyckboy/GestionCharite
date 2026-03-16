package com.project.GestionCharite.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.GestionCharite.models.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>{
  
  Optional<Organization> findByName(String name);
  Optional<Organization> findByTaxIdentificationNumber(String taxIdentificationNumber);
  // Only show valid org
  List<Organization> findByIsValidatedTrue();
  // Only show pending application for superAdmin
  List<Organization> findByIsValidatedFalse();

  List<Organization> findByManagerId(Long managerId);

}
