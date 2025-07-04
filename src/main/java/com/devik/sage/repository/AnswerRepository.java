package com.devik.sage.repository;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionOrderByCreatedAtDesc(Question question);
    Page<Answer> findByQuestionOrderByCreatedAtDesc(Question question, Pageable pageable);
    Page<Answer> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    // New methods needed by AnswerService
    Page<Answer> findByQuestionId(Long questionId, Pageable pageable);
    Optional<Answer> findByQuestionIdAndAcceptedTrue(Long questionId);

    int countByQuestionId(Long questionId);
    List<Answer> findByQuestionIdOrderByAcceptedDescUpvoteCountDescCreatedAtDesc(Long questionId);
}
