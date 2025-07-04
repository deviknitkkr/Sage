package com.devik.sage.repository;

import com.devik.sage.model.UserBadge;
import com.devik.sage.model.User;
import com.devik.sage.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserOrderByEarnedDateDesc(User user);

    @Query("SELECT ub FROM UserBadge ub WHERE ub.user.id = :userId ORDER BY ub.earnedDate DESC")
    List<UserBadge> findByUserIdOrderByEarnedDateDesc(@Param("userId") Long userId);

    Optional<UserBadge> findByUserAndBadge(User user, Badge badge);

    boolean existsByUserAndBadge(User user, Badge badge);

    @Query("SELECT COUNT(ub) FROM UserBadge ub WHERE ub.user = :user AND ub.badge.type = :badgeType")
    Long countByUserAndBadgeType(@Param("user") User user, @Param("badgeType") Badge.BadgeType badgeType);
}
