package com.devik.sage.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityItemResponse {
    private Long id;
    private String type; // "question", "answer", "badge"
    private String title;
    private LocalDateTime date;
    private String url;
}
