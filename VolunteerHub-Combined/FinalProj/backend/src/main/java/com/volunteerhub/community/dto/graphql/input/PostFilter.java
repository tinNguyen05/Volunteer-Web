package com.volunteerhub.community.dto.graphql.input;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostFilter {
    private Boolean recent;
    private Integer limit;
    private List<Long> eventIds;
}
