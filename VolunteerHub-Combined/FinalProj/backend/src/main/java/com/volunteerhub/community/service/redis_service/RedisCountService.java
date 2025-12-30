package com.volunteerhub.community.service.redis_service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisCountService {

    private final RedisTemplate<String, Object> redisTemplate;

    public int likeCount(Long targetId, String targetType) {
        String key = String.format("like:%s:%d", targetType, targetId);
        Long count = redisTemplate.opsForSet().size(key);
        return count != null ? count.intValue() : 0;
    }

    public int commentCount(Long postId) {
        String key = String.format("comment:post:%d", postId);
        Long count = redisTemplate.opsForValue().get(key) != null ? 
                     Long.parseLong(redisTemplate.opsForValue().get(key).toString()) : 0L;
        return count.intValue();
    }

    public int memberCount(Long eventId) {
        String key = String.format("member:event:%d", eventId);
        Long count = redisTemplate.opsForSet().size(key);
        return count != null ? count.intValue() : 0;
    }

    public int postCount(Long eventId) {
        String key = String.format("post:event:%d", eventId);
        Long count = redisTemplate.opsForValue().get(key) != null ? 
                     Long.parseLong(redisTemplate.opsForValue().get(key).toString()) : 0L;
        return count.intValue();
    }
}
