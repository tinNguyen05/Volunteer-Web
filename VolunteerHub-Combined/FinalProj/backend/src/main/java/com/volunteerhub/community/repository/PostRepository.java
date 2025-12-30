package com.volunteerhub.community.repository;

import com.volunteerhub.community.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByEvent_EventId(Long eventId, Pageable pageable);
    Page<Post> findByEvent_EventIdIn(List<Long> eventIds, Pageable pageable);
    long countByCreatedBy_UserId(UUID userId);
}
