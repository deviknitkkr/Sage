package com.devik.sage.repository;

import com.devik.sage.model.Comment;
import com.devik.sage.model.Question;
import com.devik.sage.model.Answer;
import com.devik.sage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByQuestionOrderByCreatedAtAsc(Question question);
    List<Comment> findByAnswerOrderByCreatedAtAsc(Answer answer);
    List<Comment> findByUserOrderByCreatedAtDesc(User user);
}
