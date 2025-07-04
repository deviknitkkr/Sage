package com.devik.sage.service;

import com.devik.sage.model.User;
import com.devik.sage.model.Question;
import com.devik.sage.model.Answer;
import com.devik.sage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReputationService {

    private final UserRepository userRepository;
    private final BadgeService badgeService;

    // Reputation points for different actions
    public static final int QUESTION_UPVOTE = 5;
    public static final int QUESTION_DOWNVOTE = -2;
    public static final int ANSWER_UPVOTE = 10;
    public static final int ANSWER_DOWNVOTE = -2;
    public static final int ANSWER_ACCEPTED = 15;
    public static final int ACCEPTING_ANSWER = 2;

    @Transactional
    public void updateReputationForQuestionVote(User user, boolean isUpvote) {
        int points = isUpvote ? QUESTION_UPVOTE : QUESTION_DOWNVOTE;
        updateUserReputation(user, points);
        log.info("Updated reputation for user {} by {} points (question vote)", user.getUsername(), points);
    }

    @Transactional
    public void updateReputationForAnswerVote(User user, boolean isUpvote) {
        int points = isUpvote ? ANSWER_UPVOTE : ANSWER_DOWNVOTE;
        updateUserReputation(user, points);
        log.info("Updated reputation for user {} by {} points (answer vote)", user.getUsername(), points);
    }

    @Transactional
    public void updateReputationForAcceptedAnswer(User answerAuthor, User questionAuthor) {
        // Answer author gets points for having their answer accepted
        updateUserReputation(answerAuthor, ANSWER_ACCEPTED);
        log.info("Updated reputation for user {} by {} points (answer accepted)", answerAuthor.getUsername(), ANSWER_ACCEPTED);

        // Question author gets points for accepting an answer
        updateUserReputation(questionAuthor, ACCEPTING_ANSWER);
        log.info("Updated reputation for user {} by {} points (accepting answer)", questionAuthor.getUsername(), ACCEPTING_ANSWER);
    }

    @Transactional
    public void updateReputationForNewQuestion(User user) {
        // No reputation change for posting questions, but check for badges
        badgeService.checkAndAwardBadges(user);
    }

    @Transactional
    public void updateReputationForNewAnswer(User user) {
        // No reputation change for posting answers, but check for badges
        badgeService.checkAndAwardBadges(user);
    }

    private void updateUserReputation(User user, int points) {
        int newReputation = Math.max(0, user.getReputation() + points); // Reputation can't go below 0
        user.setReputation(newReputation);
        userRepository.save(user);

        // Check for reputation-based badges
        badgeService.checkAndAwardBadges(user);
    }

    @Transactional(readOnly = true)
    public int calculateUserReputation(User user) {
        // This method could be used to recalculate reputation from scratch if needed
        // For now, we'll just return the stored reputation
        return user.getReputation();
    }
}
