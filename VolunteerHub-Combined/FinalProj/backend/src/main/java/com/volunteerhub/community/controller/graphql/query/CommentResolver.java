package com.volunteerhub.community.controller.graphql.query;

import com.volunteerhub.community.model.Comment;
import com.volunteerhub.community.service.redis_service.RedisCountService;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class CommentResolver {
    
    private final RedisCountService redisCountService;
    
    @SchemaMapping(typeName = "Comment", field = "likeCount")
    public Integer likeCount(Comment comment) {
        return redisCountService.likeCount(comment.getCommentId(), "comment");
    }

    @SchemaMapping(typeName = "Comment", field = "creatorInfo")
    public com.volunteerhub.community.model.UserProfileMini creatorInfo(Comment comment) {
        if (comment.getCreatedBy() == null) {
            return null;
        }
        
        com.volunteerhub.community.model.UserProfileMini mini = new com.volunteerhub.community.model.UserProfileMini();
        mini.setUserId(comment.getCreatedBy().getUserId());
        mini.setUsername(comment.getCreatedBy().getUsername());
        mini.setAvatarId(comment.getCreatedBy().getAvatarId());
        return mini;
    }

    @SchemaMapping(typeName = "Comment", field = "postId")
    public Long postId(Comment comment) {
        return comment.getPost() != null ? comment.getPost().getPostId() : null;
    }
}
