package com.project.GestionCharite.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.GestionCharite.models.Donation;
import java.util.List;
import java.util.Optional;
import com.project.GestionCharite.models.enums.DonationStatus;



@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>{
  List<Donation> findByDonorId(Long donorId);
  List<Donation> findByActionId(Long actionId);

  // for Paypal/Strip
  Optional<Donation> findByTransactionId(String transactionId);
  List<Donation> findByStatus(DonationStatus status);
}
