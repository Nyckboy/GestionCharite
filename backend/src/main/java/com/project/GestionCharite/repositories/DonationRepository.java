package com.project.GestionCharite.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.GestionCharite.models.Donation;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import com.project.GestionCharite.models.enums.DonationStatus;



@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>{
    List<Donation> findByDonorId(Long donorId);
    Page<Donation> findByDonorId(Long donorId, Pageable pageable);
    List<Donation> findByActionId(Long actionId);
    Page<Donation> findByActionId(Long actionId, Pageable pageable);

    Page<Donation> findByDonorIdAndStatus(Long donorId, DonationStatus status, Pageable pageable);
    
    Page<Donation> findByActionIdAndStatus(Long actionId, DonationStatus status, Pageable pageable);

    // for Paypal/Strip
    Optional<Donation> findByTransactionId(String transactionId);
    List<Donation> findByStatus(DonationStatus status);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.donor.id = :donorId AND d.status = :status")
    BigDecimal sumCompletedDonationsByDonorId(@Param("donorId") Long donorId, @Param("status") DonationStatus status);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.donor.id = :donorId AND d.status = :status")
    long countCompletedDonationsByDonorId(@Param("donorId") Long donorId, @Param("status") DonationStatus status);
}
