package com.volunteerhub.authentication.controller.graphql;

import com.volunteerhub.authentication.model.UserAuth;
import com.volunteerhub.authentication.model.UserAuthStatus;
import com.volunteerhub.authentication.repository.UserAuthRepository;
import com.volunteerhub.community.dto.ActionResponse;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class UserAuthResolver {
    private final UserAuthRepository userAuthRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @QueryMapping
    public List<UserAuth> getAllUserAuth() {
        return userAuthRepository.findAll();
    }

    @QueryMapping
    public UserAuth getUserAuth(@Argument String userId) {
        UUID id = UUID.fromString(userId);
        return userAuthRepository.findById(id).orElse(null);
    }

    @SchemaMapping(typeName = "UserAuth", field = "createdAt")
    public String createdAt(UserAuth userAuth) {
        return null;
    }

    @MutationMapping
    public ActionResponse<Void> approveUserAuth(@Argument String userId) {
        try {
            UUID id = UUID.fromString(userId);
            UserAuth userAuth = userAuthRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userAuth.getStatus() == UserAuthStatus.PENDING) {
                userAuth.setStatus(UserAuthStatus.ACTIVE);
                userAuthRepository.save(userAuth);
                return ActionResponse.<Void>builder()
                        .ok(true)
                        .message("User approved successfully")
                        .build();
            } else {
                return ActionResponse.<Void>builder()
                        .ok(false)
                        .message("User is not in pending status")
                        .build();
            }
        } catch (Exception e) {
            return ActionResponse.<Void>builder()
                    .ok(false)
                    .message("Failed to approve user: " + e.getMessage())
                    .build();
        }
    }

    @MutationMapping
    public ActionResponse<Void> deleteUserAuth(@Argument String userId) {
        try {
            UUID id = UUID.fromString(userId);
            if (userAuthRepository.existsById(id)) {
                userAuthRepository.deleteById(id);
                return ActionResponse.<Void>builder()
                        .ok(true)
                        .message("User deleted successfully")
                        .build();
            } else {
                return ActionResponse.<Void>builder()
                        .ok(false)
                        .message("User not found")
                        .build();
            }
        } catch (Exception e) {
            return ActionResponse.<Void>builder()
                    .ok(false)
                    .message("Failed to delete user: " + e.getMessage())
                    .build();
        }
    }

    @MutationMapping(name = "banUserAuth")
    public ActionResponse<Void> banUser(@Argument String userId) {
        try {
            UUID id = UUID.fromString(userId);
            UserAuth userAuth = userAuthRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userAuth.setStatus(UserAuthStatus.LOCKED);
            userAuthRepository.save(userAuth);
            return ActionResponse.<Void>builder()
                    .ok(true)
                    .message("User banned successfully")
                    .build();
        } catch (Exception e) {
            return ActionResponse.<Void>builder()
                    .ok(false)
                    .message("Failed to ban user: " + e.getMessage())
                    .build();
        }
    }

    @MutationMapping(name = "unbanUserAuth")
    public ActionResponse<Void> unbanUser(@Argument String userId) {
        try {
            UUID id = UUID.fromString(userId);
            UserAuth userAuth = userAuthRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userAuth.getStatus() == UserAuthStatus.LOCKED) {
                userAuth.setStatus(UserAuthStatus.ACTIVE);
                userAuthRepository.save(userAuth);
                return ActionResponse.<Void>builder()
                        .ok(true)
                        .message("User unbanned successfully")
                        .build();
            } else {
                return ActionResponse.<Void>builder()
                        .ok(false)
                        .message("User is not banned")
                        .build();
            }
        } catch (Exception e) {
            return ActionResponse.<Void>builder()
                    .ok(false)
                    .message("Failed to unban user: " + e.getMessage())
                    .build();
        }
    }
}
