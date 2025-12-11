package com.volunteerhub.community.controller.graphql.query;

import com.fasterxml.jackson.databind.JsonNode;
import com.volunteerhub.community.model.Event;
import com.volunteerhub.community.model.UserProfile;
import com.volunteerhub.community.repository.CommentRepository;
import com.volunteerhub.community.repository.EventRegistrationRepository;
import com.volunteerhub.community.repository.PostRepository;
import com.volunteerhub.community.repository.UserProfileRepository;
import com.volunteerhub.ultis.page.OffsetPage;
import com.volunteerhub.ultis.page.PageInfo;
import com.volunteerhub.ultis.page.PageUtils;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@AllArgsConstructor
public class UserProfileResolver {
    private final UserProfileRepository userProfileRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    @QueryMapping
    public OffsetPage<UserProfile> findUserProfiles(@Argument Integer page,
                                                    @Argument Integer size,
                                                    @Argument JsonNode filter)
    {
        int safePage = Math.max(page, 0);
        int safeSize = size > 0 ? size : 10;

        Pageable pageable = PageRequest.of(safePage, safeSize);
        Page<UserProfile> userProfilePage = userProfileRepository.findAll(pageable);
        PageInfo pageInfo = PageUtils.from(userProfilePage);

        return OffsetPage.<UserProfile>builder()
                .content(userProfilePage.getContent())
                .pageInfo(pageInfo)
                .build();
    }

    @QueryMapping
    public UserProfile getUserProfile(@Argument UUID userId) {
        return userProfileRepository.findById(userId).orElse(null);
    }


    @SchemaMapping(typeName = "UserProfile", field = "commentCount")
    public Integer commentCount(UserProfile userProfile) {
        return (int) commentRepository.countByCreatedBy_UserId(userProfile.getUserId());
    }

    @SchemaMapping(typeName = "UserProfile", field = "eventCount")
    public Integer eventCount(UserProfile userProfile) {
        return (int) eventRegistrationRepository.countByUserProfile_UserId(userProfile.getUserId());
    }

    @SchemaMapping(typeName = "UserProfile", field = "postCount")
    public Integer postCount(UserProfile userProfile) {
        return (int) postRepository.countByCreatedBy_UserId(userProfile.getUserId());
    }

    @SchemaMapping(typeName = "UserProfile", field = "listEvents")
    public OffsetPage<Event> listEvents(UserProfile userProfile, @Argument Integer page, @Argument Integer size) {
        int safePage = Math.max(page != null ? page : 0, 0);
        int safeSize = size != null && size > 0 ? size : 10;

        Pageable pageable = PageRequest.of(safePage, safeSize);
        Page<Event> eventPage = eventRegistrationRepository.findEventsByUserId(userProfile.getUserId(), pageable);
        PageInfo pageInfo = PageUtils.from(eventPage);

        return OffsetPage.<Event>builder()
                .content(eventPage.getContent())
                .pageInfo(pageInfo)
                .build();
    }
}
