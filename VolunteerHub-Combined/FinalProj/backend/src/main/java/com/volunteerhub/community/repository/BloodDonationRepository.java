package com.volunteerhub.community.repository;

import com.volunteerhub.community.model.BloodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodDonationRepository extends JpaRepository<BloodDonation, Long> {
    
    List<BloodDonation> findAllByOrderByCreatedAtDesc();
    
    List<BloodDonation> findByStatus(String status);
    
    @Query("SELECT COUNT(bd) FROM BloodDonation bd")
    long countAllDonations();
    
    @Query("SELECT COUNT(bd) FROM BloodDonation bd WHERE bd.status = 'pending'")
    long countPendingDonations();
    
    @Query("SELECT bd.bloodType, COUNT(bd) FROM BloodDonation bd GROUP BY bd.bloodType")
    List<Object[]> countByBloodType();
}
