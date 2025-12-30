package com.volunteerhub.community.dto.graphql;

import com.volunteerhub.community.model.UserProfileMini;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSummary {
    private Long eventId;
    private String eventName;
    private LocalDateTime createdAt;
    private Integer memberCount;
    private Integer postCount;
    private Integer likeCount;
    private UserProfileMini creatorInfo;
}
