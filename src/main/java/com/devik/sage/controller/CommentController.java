package com.devik.sage.controller;

import com.devik.sage.dto.CommentRequest;
import com.devik.sage.dto.CommentResponse;
import com.devik.sage.model.Comment;
import com.devik.sage.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByQuestion(@PathVariable Long questionId) {
        List<Comment> comments = commentService.getCommentsByQuestion(questionId);
        List<CommentResponse> responses = comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/answer/{answerId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByAnswer(@PathVariable Long answerId) {
        List<Comment> comments = commentService.getCommentsByAnswer(answerId);
        List<CommentResponse> responses = comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/question/{questionId}")
    public ResponseEntity<CommentResponse> createCommentForQuestion(
            @PathVariable Long questionId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Comment comment = commentService.createCommentForQuestion(questionId, request.getContent(), username);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponse(comment));
    }

    @PostMapping("/answer/{answerId}")
    public ResponseEntity<CommentResponse> createCommentForAnswer(
            @PathVariable Long answerId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Comment comment = commentService.createCommentForAnswer(answerId, request.getContent(), username);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponse(comment));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Comment comment = commentService.updateComment(commentId, request.getContent(), username);
        return ResponseEntity.ok(convertToResponse(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        String username = authentication.getName();
        commentService.deleteComment(commentId, username);
        return ResponseEntity.noContent().build();
    }

    private CommentResponse convertToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getBody());
        response.setAuthorUsername(comment.getUser().getUsername());
        response.setAuthorId(comment.getUser().getId());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        response.setIsAuthor(true); // This will be set correctly in the service layer
        return response;
    }
}
