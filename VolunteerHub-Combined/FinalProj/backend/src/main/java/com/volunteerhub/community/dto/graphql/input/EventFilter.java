package com.volunteerhub.community.dto.graphql.input;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventFilter {
    private Boolean recentlyCreated;
    private Boolean trending;
    private Integer limit;
    private LocalDateTime since;
}
