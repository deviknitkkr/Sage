package com.devik.sage.service;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Comment;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.repository.AnswerRepository;
import com.devik.sage.repository.CommentRepository;
import com.devik.sage.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public List<Comment> getCommentsByQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return commentRepository.findByQuestionOrderByCreatedAtAsc(question);
    }

    public List<Comment> getCommentsByAnswer(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        return commentRepository.findByAnswerOrderByCreatedAtAsc(answer);
    }

    @Transactional
    public Comment addCommentToQuestion(Long questionId, String body, User currentUser) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Comment comment = new Comment();
        comment.setBody(body);
        comment.setUser(currentUser);
        comment.setQuestion(question);

        return commentRepository.save(comment);
    }

    @Transactional
    public Comment addCommentToAnswer(Long answerId, String body, User currentUser) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Comment comment = new Comment();
        comment.setBody(body);
        comment.setUser(currentUser);
        comment.setAnswer(answer);

        return commentRepository.save(comment);
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Transactional
    public Comment updateComment(Long commentId, String body, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this comment");
        }

        comment.setBody(body);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, User currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
