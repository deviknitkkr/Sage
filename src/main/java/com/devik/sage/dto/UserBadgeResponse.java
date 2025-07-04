package com.devik.sage.dto;

import com.devik.sage.model.Badge;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeResponse {
    private Long id;
    private String name;
    private String description;
    private Badge.BadgeType type;
    private String icon;
    private LocalDateTime earnedDate;
    private String reason;
}
