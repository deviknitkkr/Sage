package com.devik.sage.service;

import com.devik.sage.model.Badge;
import com.devik.sage.model.User;
import com.devik.sage.model.UserBadge;
import com.devik.sage.repository.BadgeRepository;
import com.devik.sage.repository.UserBadgeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    @Transactional(readOnly = true)
    public List<Badge> getAllActiveBadges() {
        return badgeRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<UserBadge> getUserBadges(User user) {
        return userBadgeRepository.findByUserOrderByEarnedDateDesc(user);
    }

    @Transactional
    public UserBadge awardBadge(User user, String badgeName, String reason) {
        Optional<Badge> badgeOpt = badgeRepository.findByNameAndIsActiveTrue(badgeName);
        if (badgeOpt.isEmpty()) {
            log.warn("Badge not found: {}", badgeName);
            return null;
        }

        Badge badge = badgeOpt.get();

        // Check if user already has this badge
        if (userBadgeRepository.existsByUserAndBadge(user, badge)) {
            log.info("User {} already has badge {}", user.getUsername(), badgeName);
            return null;
        }

        UserBadge userBadge = new UserBadge();
        userBadge.setUser(user);
        userBadge.setBadge(badge);
        userBadge.setReason(reason);

        UserBadge saved = userBadgeRepository.save(userBadge);
        log.info("Awarded badge {} to user {}", badgeName, user.getUsername());

        return saved;
    }

    @Transactional(readOnly = true)
    public Long getBadgeCountByType(User user, Badge.BadgeType type) {
        return userBadgeRepository.countByUserAndBadgeType(user, type);
    }

    @Transactional
    public void checkAndAwardBadges(User user) {
        // Check for various badge criteria
        checkQuestionBadges(user);
        checkAnswerBadges(user);
        checkReputationBadges(user);
    }

    private void checkQuestionBadges(User user) {
        int questionCount = user.getQuestions().size();

        if (questionCount >= 1) {
            awardBadge(user, "Student", "Asked first question");
        }
        if (questionCount >= 10) {
            awardBadge(user, "Inquisitive", "Asked 10 questions");
        }
        if (questionCount >= 50) {
            awardBadge(user, "Socratic", "Asked 50 questions");
        }
    }

    private void checkAnswerBadges(User user) {
        int answerCount = user.getAnswers().size();

        if (answerCount >= 1) {
            awardBadge(user, "Teacher", "Answered first question");
        }
        if (answerCount >= 10) {
            awardBadge(user, "Enlightened", "Answered 10 questions");
        }
        if (answerCount >= 50) {
            awardBadge(user, "Guru", "Answered 50 questions");
        }
    }

    private void checkReputationBadges(User user) {
        int reputation = user.getReputation();

        if (reputation >= 100) {
            awardBadge(user, "Trusted", "Reached 100 reputation");
        }
        if (reputation >= 500) {
            awardBadge(user, "Established", "Reached 500 reputation");
        }
        if (reputation >= 1000) {
            awardBadge(user, "Notable", "Reached 1000 reputation");
        }
        if (reputation >= 5000) {
            awardBadge(user, "Famous", "Reached 5000 reputation");
        }
    }
}
