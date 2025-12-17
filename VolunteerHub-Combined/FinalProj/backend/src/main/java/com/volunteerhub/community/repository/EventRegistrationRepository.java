package com.volunteerhub.community.repository;

import com.volunteerhub.community.model.Event;
import com.volunteerhub.community.model.EventRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    // Kiểm tra đã đăng ký chưa (không cần status)
    boolean existsByUserIdAndEventId(UUID userId, Long eventId);

    // Tìm đăng ký theo userId và eventId
    Optional<EventRegistration> findByUserIdAndEventId(UUID userId, Long eventId);
    
    // Đếm số lượng đăng ký của user
    long countByUserProfile_UserId(UUID userId);
    
    // Lấy danh sách Event mà user đã đăng ký
    @Query("SELECT er.event FROM EventRegistration er WHERE er.userProfile.userId = :userId")
    Page<Event> findEventsByUserId(@Param("userId") UUID userId, Pageable pageable);
    
    // Lấy danh sách eventId mà user đã đăng ký (theo userId)
    @Query("SELECT er.eventId FROM EventRegistration er WHERE er.userId = :userId")
    List<Long> findEventIdsByUserId(@Param("userId") UUID userId);
    
    // Lấy danh sách eventId mà user đã đăng ký (theo email từ JWT)
    @Query("SELECT er.eventId FROM EventRegistration er WHERE er.userProfile.email = :email")
    List<Long> findEventIdsByUserEmail(@Param("email") String email);
}
