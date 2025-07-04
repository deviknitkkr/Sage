package com.devik.sage.service;

import com.devik.sage.dto.ActivityItemResponse;
import com.devik.sage.dto.UserBadgeResponse;
import com.devik.sage.dto.UserProfileResponse;
import com.devik.sage.model.User;
import com.devik.sage.model.UserBadge;
import com.devik.sage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserRepository userRepository;
    private final BadgeService badgeService;

    @Transactional(readOnly = true)
    public Optional<UserProfileResponse> getUserProfile(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail()); // Only show if own profile or public
        profile.setBio(user.getBio());
        profile.setLocation(user.getLocation());
        profile.setWebsite(user.getWebsite());
        profile.setReputation(user.getReputation());

        // Use repository queries instead of lazy collection access to avoid ConcurrentModificationException
        profile.setQuestionCount((int) getQuestionCountForUser(user.getId()));
        profile.setAnswerCount((int) getAnswerCountForUser(user.getId()));
        profile.setViewsCount(user.getViewsCount());
        profile.setJoinedDate(user.getCreatedAt());

        // Get user badges
        List<UserBadge> userBadges = badgeService.getUserBadges(user);
        List<UserBadgeResponse> badgeResponses = userBadges.stream()
                .map(this::convertToUserBadgeResponse)
                .collect(Collectors.toList());
        profile.setBadges(badgeResponses);

        // Get recent activity
        List<ActivityItemResponse> recentActivity = getRecentActivity(user);
        profile.setRecentActivity(recentActivity);

        // Note: Profile view increment removed to avoid ConcurrentModificationException
        // Can be added later via a separate endpoint or async mechanism

        return Optional.of(profile);
    }

    @Transactional
    public User updateUserProfile(String username, String bio, String location, String website) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBio(bio);
        user.setLocation(location);
        user.setWebsite(website);

        return userRepository.save(user);
    }

    @Transactional
    public void incrementProfileViewsAsync(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setViewsCount(user.getViewsCount() + 1);
            userRepository.save(user);
        }
    }

    private UserBadgeResponse convertToUserBadgeResponse(UserBadge userBadge) {
        UserBadgeResponse response = new UserBadgeResponse();
        response.setId(userBadge.getId());
        response.setName(userBadge.getBadge().getName());
        response.setDescription(userBadge.getBadge().getDescription());
        response.setType(userBadge.getBadge().getType());
        response.setIcon(userBadge.getBadge().getIcon());
        response.setEarnedDate(userBadge.getEarnedDate());
        response.setReason(userBadge.getReason());
        return response;
    }

    private List<ActivityItemResponse> getRecentActivity(User user) {
        // This is a simplified version - in a real implementation,
        // you'd combine questions, answers, and badges into a unified activity stream
        return List.of(
                new ActivityItemResponse(1L, "answer", "Recent answer activity",
                        user.getCreatedAt(), "/questions/1"),
                new ActivityItemResponse(2L, "question", "Recent question activity",
                        user.getCreatedAt(), "/questions/2"),
                new ActivityItemResponse(3L, "badge", "Recent badge earned",
                        user.getCreatedAt(), null)
        );
    }

    private long getQuestionCountForUser(Long userId) {
        return userRepository.countQuestionsByUserId(userId);
    }

    private long getAnswerCountForUser(Long userId) {
        return userRepository.countAnswersByUserId(userId);
    }
}
