package com.devik.sage.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private BadgeType type;

    @Column(name = "icon")
    private String icon;

    @Column(name = "criteria")
    private String criteria;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum BadgeType {
        GOLD, SILVER, BRONZE
    }
}
