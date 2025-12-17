package com.volunteerhub.community.controller.rest;

import com.volunteerhub.community.repository.EventRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/event-registrations")
@RequiredArgsConstructor
public class EventRegistrationController {
    
    private final EventRegistrationRepository eventRegistrationRepo;

    @GetMapping("/my-registered-event-ids")
    public ResponseEntity<?> getMyRegisteredEventIds() {
        try {
            // Get Email from Spring Security Context (JWT token)
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            
            System.out.println("� DEBUG: Đang tìm event cho email: " + currentUserEmail);
            
            if (currentUserEmail == null || currentUserEmail.equals("anonymousUser")) {
                return ResponseEntity.status(401).body("Chưa đăng nhập hoặc Token lỗi");
            }
            
            // Get event IDs using email-based query
            List<Long> eventIds = eventRegistrationRepo.findEventIdsByUserEmail(currentUserEmail);
            
            System.out.println("✅ DEBUG: Tìm thấy " + eventIds.size() + " sự kiện.");
            
            return ResponseEntity.ok(eventIds);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi Server: " + e.getMessage());
        }
    }
}
