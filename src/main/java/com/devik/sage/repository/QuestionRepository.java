package com.devik.sage.repository;

import com.devik.sage.model.Question;
import com.devik.sage.model.Tag;
import com.devik.sage.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Question> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Page<Question> findByTagsContainsOrderByCreatedAtDesc(Tag tag, Pageable pageable);

    // Search methods needed by service
    Page<Question> findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
            String title, String body, Pageable pageable);

    @Query("SELECT q FROM Question q JOIN q.tags t WHERE t.name = :tagName")
    Page<Question> findByTagsName(@Param("tagName") String tagName, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(q.body) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Question> searchQuestions(@Param("query") String query, Pageable pageable);

    @Query("SELECT q FROM Question q JOIN q.tags t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :tagName, '%'))")
    Page<Question> findByTagNameContaining(@Param("tagName") String tagName, Pageable pageable);

    // Add method to count answers without lazy loading
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.question.id = :questionId")
    Long countAnswersByQuestionId(@Param("questionId") Long questionId);
}
