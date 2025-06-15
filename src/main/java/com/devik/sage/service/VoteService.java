package com.devik.sage.service;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.model.Vote;
import com.devik.sage.repository.AnswerRepository;
import com.devik.sage.repository.QuestionRepository;
import com.devik.sage.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Transactional
    public Vote voteQuestion(Long questionId, User currentUser, Vote.VoteType voteType) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Check if user is voting on their own question
        if (question.getUser().getId().equals(currentUser.getId())) {
            // Return null instead of throwing an exception
            return null;
        }

        // Check if user has already voted on this question
        Optional<Vote> existingVote = voteRepository.findByUserAndQuestion(currentUser, question);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            // If same vote type, do nothing (can't cancel votes)
            if (vote.getVoteType() == voteType) {
                return vote; // Return existing vote without changes
            } else {
                // Change vote type (from upvote to downvote or vice versa)
                vote.setVoteType(voteType);
                return voteRepository.save(vote);
            }
        } else {
            // Create new vote
            Vote vote = new Vote();
            vote.setUser(currentUser);
            vote.setQuestion(question);
            vote.setVoteType(voteType);
            return voteRepository.save(vote);
        }
    }

    @Transactional
    public Vote voteAnswer(Long answerId, User currentUser, Vote.VoteType voteType) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        // Check if user is voting on their own answer
        if (answer.getUser().getId().equals(currentUser.getId())) {
            // Return null instead of throwing an exception
            return null;
        }

        // Check if user has already voted on this answer
        Optional<Vote> existingVote = voteRepository.findByUserAndAnswer(currentUser, answer);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            // If same vote type, do nothing (can't cancel votes)
            if (vote.getVoteType() == voteType) {
                return vote; // Return existing vote without changes
            } else {
                // Change vote type (from upvote to downvote or vice versa)
                vote.setVoteType(voteType);
                return voteRepository.save(vote);
            }
        } else {
            // Create new vote
            Vote vote = new Vote();
            vote.setUser(currentUser);
            vote.setAnswer(answer);
            vote.setVoteType(voteType);
            return voteRepository.save(vote);
        }
    }

    public boolean hasUserVotedOnQuestion(User user, Question question, Vote.VoteType voteType) {
        Optional<Vote> vote = voteRepository.findByUserAndQuestion(user, question);
        return vote.isPresent() && vote.get().getVoteType() == voteType;
    }

    public boolean hasUserVotedOnAnswer(User user, Answer answer, Vote.VoteType voteType) {
        Optional<Vote> vote = voteRepository.findByUserAndAnswer(user, answer);
        return vote.isPresent() && vote.get().getVoteType() == voteType;
    }
}
