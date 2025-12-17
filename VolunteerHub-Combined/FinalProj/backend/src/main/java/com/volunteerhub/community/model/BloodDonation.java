package com.volunteerhub.community.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_donation")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodDonation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "blood_type", nullable = false, length = 10)
    private String bloodType;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "desired_date", nullable = false)
    private LocalDate desiredDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status", length = 50)
    private String status = "PENDING";

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
