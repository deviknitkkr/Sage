package com.devik.sage.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String location;
    private String website;
    private Integer reputation;
    private Integer questionCount;
    private Integer answerCount;
    private Integer viewsCount;
    private LocalDateTime joinedDate;
    private List<UserBadgeResponse> badges;
    private List<ActivityItemResponse> recentActivity;
}
