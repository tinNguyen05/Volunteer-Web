package com.volunteerhub.authentication.service;

import com.volunteerhub.authentication.dto.request.SignUpRequest;
import com.volunteerhub.authentication.model.Role;
import com.volunteerhub.authentication.model.UserAuth;
import com.volunteerhub.authentication.model.UserAuthStatus;
import com.volunteerhub.authentication.repository.UserAuthRepository;
import com.volunteerhub.community.model.UserProfile;
import com.volunteerhub.community.model.db_enum.UserStatus;
import com.volunteerhub.community.repository.UserProfileRepository;
import com.volunteerhub.ultis.TokenUtil;
import com.volunteerhub.authentication.ultis.exception.VerificationException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignupService {
    private final UserAuthRepository userAuthRepository;
    private final UserProfileRepository userProfileRepository;
    private final EmailService emailService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.verify-path}")
    private String verifyPath;

    @Value("${app.api-url}")
    private String apiUrl;

    @Value("${app.require-verify")
    private String requireVerify;

    @Transactional
    public void signup(SignUpRequest request) {
        if (userAuthRepository.existsByEmail(request.getEmail())) {
            throw new VerificationException("Email already registered");
        }

        UUID newUserId = UUID.randomUUID();
        
        // Determine role from request
        Role role = Role.USER;
        UserAuthStatus status = UserAuthStatus.ACTIVE;
        
        if ("EVENT_MANAGER".equalsIgnoreCase(request.getRole())) {
            role = Role.EVENT_MANAGER;
            status = UserAuthStatus.PENDING; // Manager cần admin duyệt
        }

        if ("enable".equals(requireVerify)) {
            UserAuth userAuth = UserAuth.builder()
                    .userId(newUserId)
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .status(status)
                    .build();

            userAuthRepository.save(userAuth);
            
            // 🔥 TẠO USER PROFILE TỰ ĐỘNG
            createUserProfile(newUserId, request.getEmail());

            sendVerificationEmail(newUserId, request.getEmail());
            return;
        }

        UserAuth userAuth = UserAuth.builder()
                .userId(newUserId)
                .emailVerified(true)
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(status)
                .build();

        userAuthRepository.save(userAuth);
        
        // 🔥 TẠO USER PROFILE TỰ ĐỘNG
        createUserProfile(newUserId, request.getEmail());
    }

    @Transactional
    public void verify(String rawToken) {
        String hashed = TokenUtil.sha256(rawToken);
        String key = "verify:" + hashed;

        String userIdStr = (String) redisTemplate.opsForValue().get(key);
        if (userIdStr == null) {
            throw new VerificationException("Invalid or expired token");
        }

        UUID userId = UUID.fromString(userIdStr);
        UserAuth user = userAuthRepository.findById(userId)
                .orElseThrow(() -> new VerificationException("User not found"));

        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userAuthRepository.save(user);
        }

        redisTemplate.delete(key);
        redisTemplate.delete("verify_index:" + userId);
    }

    @Transactional
    public void resend(String email) {
        UserAuth user = userAuthRepository.findByEmail(email)
                .orElseThrow(() -> new VerificationException("User not found"));

        if (user.isEmailVerified()) {
            throw new VerificationException("User already verified");
        }

        sendVerificationEmail(user.getUserId(), email);
    }

    /**
     * Tạo UserProfile tự động khi đăng ký
     * Fix lỗi 500: username và status NOT NULL
     */
    private void createUserProfile(UUID userId, String email) {
        try {
            // Tạo username tự động từ email hoặc timestamp
            String username = email.split("@")[0] + "_" + System.currentTimeMillis();
            
            UserProfile profile = UserProfile.builder()
                    .userId(userId)
                    .username(username)
                    .fullName("Người dùng mới")
                    .email(email)
                    .status(UserStatus.ACTIVE)
                    .build();
            
            userProfileRepository.save(profile);
            log.info("✅ Created UserProfile for userId: {}, username: {}", userId, username);
        } catch (Exception e) {
            log.error("❌ Failed to create UserProfile for userId: {}", userId, e);
            throw new VerificationException("Failed to create user profile: " + e.getMessage());
        }
    }

    private void sendVerificationEmail(UUID userId, String email) {
        String indexKey = "verify_index:" + userId;
        String oldTokenHash = (String) redisTemplate.opsForValue().get(indexKey);

        if (oldTokenHash != null) {
            redisTemplate.delete("verify:" + oldTokenHash);
            redisTemplate.delete(indexKey);
        }

        String rawToken = TokenUtil.generateRawToken(30);
        String hashed = TokenUtil.sha256(rawToken);

        redisTemplate.opsForValue().set("verify:" + hashed, userId.toString(), Duration.ofMinutes(15));
        redisTemplate.opsForValue().set(indexKey, hashed, Duration.ofMinutes(15));

        String verifyLink = String.format("%s%s?token=%s", apiUrl, verifyPath,
                URLEncoder.encode(rawToken, StandardCharsets.UTF_8));

        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendHtmlMail(
                        email,
                        "Verify your account",
                        verifyLink
                );
            } catch (Exception e) {
                log.error("Error while sending verification email", e);
            }
        });
    }
}
