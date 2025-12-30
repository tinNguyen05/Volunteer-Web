package com.volunteerhub.community.dto.graphql;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSummary {
    private Long postId;
    private Long eventId;
    private LocalDateTime createdAt;
    private Integer commentCount;
    private Integer likeCount;
}
