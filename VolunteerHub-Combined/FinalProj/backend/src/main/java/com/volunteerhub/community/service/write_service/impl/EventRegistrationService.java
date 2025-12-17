package com.volunteerhub.community.service.write_service.impl;

import com.volunteerhub.community.dto.ActionResponse;
import com.volunteerhub.community.model.Event;
import com.volunteerhub.community.model.EventRegistration;
import com.volunteerhub.community.model.RoleInEvent;
import com.volunteerhub.community.model.UserProfile;
import com.volunteerhub.community.model.db_enum.ParticipationStatus;
import com.volunteerhub.community.repository.EventRegistrationRepository;
import com.volunteerhub.community.repository.EventRepository;
import com.volunteerhub.community.repository.RoleInEventRepository;
import com.volunteerhub.community.repository.UserProfileRepository;
import com.volunteerhub.community.service.write_service.IEventRegistrationService;
import com.volunteerhub.ultis.SnowflakeIdGenerator;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class EventRegistrationService implements IEventRegistrationService {

    private final EventRegistrationRepository eventRegistrationRepo;
    private final RoleInEventRepository roleInEventRepo;
    private final EventRepository eventRepo;
    private final UserProfileRepository userProfileRepo;
    private final SnowflakeIdGenerator snowflakeIdGenerator;

    @Override
    public ActionResponse<Void> approveRegistration(Long registrationId) {
        EventRegistration reg = eventRegistrationRepo.findById(registrationId).orElse(null);

        if (reg == null) {
            return ActionResponse.failure(
                    String.format("Registration not found (registrationId: %d)", registrationId));
        }

        Long eventId = reg.getEventId();
        UUID userId = reg.getUserId();

        if (roleInEventRepo.existsByUserProfile_UserIdAndEvent_EventIdAndParticipationStatusIn(
                userId, eventId, List.of(ParticipationStatus.APPROVED, ParticipationStatus.COMPLETED))) {
            return ActionResponse.failure(
                    String.format("User already registered for this event (eventId: %d)", eventId));
        }

        RoleInEvent roleInEvent = RoleInEvent.builder()
                .event(reg.getEvent())
                .userProfile(reg.getUserProfile())
                .build();
        roleInEventRepo.save(roleInEvent);

        return ActionResponse.success(
                registrationId.toString(),
                null,
                LocalDateTime.now());
    }

    @Override
    public ActionResponse<Void> rejectRegistration(Long registrationId) {
        EventRegistration reg = eventRegistrationRepo.findById(registrationId).orElse(null);

        if (reg == null) {
            return ActionResponse.failure(
                    String.format("Registration not found (registrationId: %d)", registrationId));
        }

        Long eventId = reg.getEventId();
        UUID userId = reg.getUserId();

        if (roleInEventRepo.existsByUserProfile_UserIdAndEvent_EventIdAndParticipationStatusIn(
                userId, eventId, List.of(ParticipationStatus.APPROVED, ParticipationStatus.COMPLETED))) {
            return ActionResponse.failure(
                    String.format("User already registered for this event (eventId: %d)", eventId));
        }

        // Xóa đăng ký thay vì set status
        eventRegistrationRepo.delete(reg);

        return ActionResponse.success(
                registrationId.toString(),
                null,
                LocalDateTime.now());
    }

    @Override
    public ActionResponse<Void> registerEvent(UUID userId, Long eventId) {

        // Kiểm tra đã đăng ký chưa (không cần status)
        if (eventRegistrationRepo.existsByUserIdAndEventId(userId, eventId)) {
            return ActionResponse.failure("You are already registered for this event");
        }

        if (!eventRepo.existsById(eventId)) {
            return ActionResponse.failure(
                    String.format("Event not found (eventId: %d)", eventId));
        }

        if (roleInEventRepo.existsByUserProfile_UserIdAndEvent_EventIdAndParticipationStatusIn(
                userId, eventId, List.of(ParticipationStatus.APPROVED, ParticipationStatus.COMPLETED))) {
            return ActionResponse.failure(
                    String.format("User already registered for this event (eventId: %d)", eventId));
        }

        UserProfile userProfile = userProfileRepo.getReferenceById(userId);
        Event event = eventRepo.getReferenceById(eventId);

        EventRegistration reg = EventRegistration.builder()
                .registrationId(snowflakeIdGenerator.nextId())
                .userProfile(userProfile)
                .event(event)
                .build();

        eventRegistrationRepo.save(reg);

        return ActionResponse.success(
                reg.getRegistrationId().toString(),
                LocalDateTime.now(),
                LocalDateTime.now());
    }

    @Override
    public ActionResponse<Void> unregisterEvent(UUID userId, Long eventId) {
        EventRegistration reg = eventRegistrationRepo.findByUserIdAndEventId(userId, eventId).orElse(null);

        if (reg == null) {
            return ActionResponse.failure(
                    "Unable to unregister because this registration does not exist");
        }

        // Xóa hẳn đăng ký khỏi database (hard delete)
        eventRegistrationRepo.delete(reg);

        return ActionResponse.success(
                reg.getRegistrationId().toString(),
                null,
                LocalDateTime.now());
    }
}
