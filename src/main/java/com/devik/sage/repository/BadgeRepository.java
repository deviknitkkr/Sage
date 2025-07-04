package com.devik.sage.repository;

import com.devik.sage.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByIsActiveTrue();
    Optional<Badge> findByNameAndIsActiveTrue(String name);
    List<Badge> findByTypeAndIsActiveTrue(Badge.BadgeType type);
}
