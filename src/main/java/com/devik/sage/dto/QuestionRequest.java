package com.devik.sage.dto;

import lombok.Data;

@Data
public class QuestionRequest {
    private String title;
    private String content;
    private String tags; // comma-separated tags
}
