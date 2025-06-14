package com.devik.sage.repository;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserAndQuestion(User user, Question question);
    Optional<Vote> findByUserAndAnswer(User user, Answer answer);

    int countByQuestionAndVoteType(Question question, Vote.VoteType voteType);
    int countByAnswerAndVoteType(Answer answer, Vote.VoteType voteType);

    boolean existsByUserAndQuestion(User user, Question question);
    boolean existsByUserAndAnswer(User user, Answer answer);
}
