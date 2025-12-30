package com.volunteerhub.community.controller.graphql.query;

import com.volunteerhub.community.dto.graphql.EventSummary;
import com.volunteerhub.community.dto.graphql.PostSummary;
import com.volunteerhub.community.dto.graphql.input.EventFilter;
import com.volunteerhub.community.dto.graphql.input.PostFilter;
import com.volunteerhub.community.model.Event;
import com.volunteerhub.community.model.Post;
import com.volunteerhub.community.model.UserProfileMini;
import com.volunteerhub.community.repository.EventRepository;
import com.volunteerhub.community.repository.PostRepository;
import com.volunteerhub.community.service.redis_service.RedisCountService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor
public class DashboardResolver {
    
    private final EventRepository eventRepository;
    private final PostRepository postRepository;
    private final RedisCountService redisCountService;

    @QueryMapping
    public List<EventSummary> dashboardEvents(@Argument EventFilter filter) {
        if (filter == null) {
            filter = EventFilter.builder()
                    .recentlyCreated(true)
                    .limit(10)
                    .build();
        }

        int limit = filter.getLimit() != null ? filter.getLimit() : 10;
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        List<Event> events = eventRepository.findAll(pageable).getContent();
        
        return events.stream().map(event -> EventSummary.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .createdAt(event.getCreatedAt())
                .memberCount(redisCountService.memberCount(event.getEventId()))
                .postCount(redisCountService.postCount(event.getEventId()))
                .likeCount(redisCountService.likeCount(event.getEventId(), "event"))
                .creatorInfo(event.getCreatedBy() != null ? UserProfileMini.builder()
                        .userId(event.getCreatedBy().getUserId())
                        .username(event.getCreatedBy().getUsername())
                        .avatarId(event.getCreatedBy().getAvatarId())
                        .build() : null)
                .build()
        ).collect(Collectors.toList());
    }

    @QueryMapping
    public List<PostSummary> dashboardPosts(@Argument PostFilter filter) {
        if (filter == null) {
            filter = PostFilter.builder()
                    .recent(true)
                    .limit(10)
                    .build();
        }

        int limit = filter.getLimit() != null ? filter.getLimit() : 10;
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        List<Post> posts;
        if (filter.getEventIds() != null && !filter.getEventIds().isEmpty()) {
            posts = postRepository.findByEvent_EventIdIn(filter.getEventIds(), pageable).getContent();
        } else {
            posts = postRepository.findAll(pageable).getContent();
        }
        
        return posts.stream().map(post -> PostSummary.builder()
                .postId(post.getPostId())
                .eventId(post.getEvent() != null ? post.getEvent().getEventId() : null)
                .createdAt(post.getCreatedAt())
                .commentCount(redisCountService.commentCount(post.getPostId()))
                .likeCount(redisCountService.likeCount(post.getPostId(), "post"))
                .build()
        ).collect(Collectors.toList());
    }
}
