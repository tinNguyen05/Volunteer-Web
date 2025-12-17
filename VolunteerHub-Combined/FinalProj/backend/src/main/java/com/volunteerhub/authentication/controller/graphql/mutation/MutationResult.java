package com.volunteerhub.community.controller.graphql.mutation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MutationResult {
    private boolean ok;
    private String id;
    private String message;
    private String createdAt;
    private String updatedAt;
}