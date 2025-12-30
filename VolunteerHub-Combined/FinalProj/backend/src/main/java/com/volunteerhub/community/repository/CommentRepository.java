package com.volunteerhub.community.repository;

import com.volunteerhub.community.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPost_PostId(Long postId, Pageable pageable);
    long countByCreatedBy_UserId(UUID userId);
}
