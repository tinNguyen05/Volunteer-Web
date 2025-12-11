package com.volunteerhub.community.repository;

import com.volunteerhub.community.model.Event;
import com.volunteerhub.community.model.EventRegistration;
import com.volunteerhub.community.model.db_enum.RegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    boolean existsByUserIdAndEventIdAndStatus(
            UUID userId, Long eventId, RegistrationStatus status);

    Optional<EventRegistration> findByUserIdAndEventIdAndStatus(
            UUID userId, Long eventId, RegistrationStatus status);

    Optional<EventRegistration> findByUserIdAndStatus(UUID userId, RegistrationStatus status);
    
    long countByUserProfile_UserId(UUID userId);
    
    @Query("SELECT er.event FROM EventRegistration er WHERE er.userProfile.userId = :userId AND er.status = 'ACCEPTED'")
    Page<Event> findEventsByUserId(@Param("userId") UUID userId, Pageable pageable);
}
