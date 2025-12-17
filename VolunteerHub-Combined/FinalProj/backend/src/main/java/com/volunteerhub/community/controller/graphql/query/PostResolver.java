package com.volunteerhub.community.controller.graphql.query;

import com.volunteerhub.community.model.Comment;
import com.volunteerhub.community.model.Post;
import com.volunteerhub.community.model.db_enum.TableType;
import com.volunteerhub.community.repository.LikeRepository;
import com.volunteerhub.community.service.redis_service.RedisCountService;
import com.volunteerhub.ultis.page.OffsetPage;
import com.volunteerhub.ultis.page.PageInfo;
import com.volunteerhub.ultis.page.PageUtils;

import com.volunteerhub.community.repository.CommentRepository;
import com.volunteerhub.community.repository.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class PostResolver {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final RedisCountService redisCountService;
    private final LikeRepository likeRepository;

    @QueryMapping
    public Post getPost(@Argument Long postId) {
        return postRepository.findById(postId).orElse(null);
    }

    @QueryMapping
    public OffsetPage<Post> findPosts(@Argument Integer page,
                                      @Argument Integer size,
                                      @Argument Map<String, Object> filter) {
        int safePage = Math.max(page, 0);
        int safeSize = size > 0 ? size : 10;

        Pageable pageable = PageRequest.of(safePage, safeSize);
        Page<Post> postPage = postRepository.findAll(pageable);
        PageInfo pageInfo = PageUtils.from(postPage);
        return OffsetPage.<Post>builder()
                .content(postPage.getContent())
                .pageInfo(pageInfo)
                .build();
    }

    @SchemaMapping(typeName = "Post", field = "listComment")
    public OffsetPage<Comment> listComment(Post Post, @Argument Integer page, @Argument Integer size) {
        int safePage = Math.max(page, 0);
        int safeSize = size > 0 ? size : 10;

        Pageable pageable = PageRequest.of(safePage, safeSize);
        Page<Comment> commentPage = commentRepository.findByPost_PostId(Post.getPostId(), pageable);
        PageInfo pageInfo = PageUtils.from(commentPage);
        return OffsetPage.<Comment>builder()
                .content(commentPage.getContent())
                .pageInfo(pageInfo)
                .build();
    }

    @SchemaMapping(typeName = "Post", field = "commentCount")
    public Integer commentCount(Post post) {
        return redisCountService.commentCount(post.getPostId());
    }

    @SchemaMapping(typeName = "Post", field = "likeCount")
    public Integer likeCount(Post post) {
        return redisCountService.likeCount(post.getPostId(), "post");
    }

    @SchemaMapping(typeName = "Post", field = "creatorInfo")
    public com.volunteerhub.community.model.UserProfileMini creatorInfo(Post post) {
        if (post.getCreatedBy() == null) {
            return null;
        }
        
        com.volunteerhub.community.model.UserProfileMini mini = new com.volunteerhub.community.model.UserProfileMini();
        mini.setUserId(post.getCreatedBy().getUserId());
        mini.setUsername(post.getCreatedBy().getUsername());
        mini.setAvatarId(post.getCreatedBy().getAvatarId());
        return mini;
    }

    @SchemaMapping(typeName = "Post", field = "isLiked")
    public Boolean isLiked(Post post) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            if (email == null || email.equals("anonymousUser")) {
                return false;
            }
            
            // Parse UUID from email (assuming email format contains UUID)
            // You might need to adjust this based on your authentication structure
            String userIdStr = email; // Adjust if needed
            UUID userId;
            try {
                userId = UUID.fromString(userIdStr);
            } catch (IllegalArgumentException e) {
                // If email is not UUID format, return false
                return false;
            }
            
            return likeRepository.existsByTargetIdAndTableTypeAndCreatedBy_UserId(
                post.getPostId(), 
                TableType.POST, 
                userId
            );
        } catch (Exception e) {
            return false;
        }
    }
}
