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
}
