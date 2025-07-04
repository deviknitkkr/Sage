package com.devik.sage.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AnswerResponse {
    private Long id;
    private String content;
    private String authorUsername;
    private Long authorId;
    private Long questionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean accepted;
    private int upvoteCount;
    private int downvoteCount;
    private int totalVotes;
    private boolean isAuthor;
}
