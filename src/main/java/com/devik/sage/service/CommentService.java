package com.devik.sage.service;

import com.devik.sage.exception.ResourceNotFoundException;
import com.devik.sage.model.Answer;
import com.devik.sage.model.Comment;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.repository.AnswerRepository;
import com.devik.sage.repository.CommentRepository;
import com.devik.sage.repository.QuestionRepository;
import com.devik.sage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    public List<Comment> getCommentsByQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        return commentRepository.findByQuestionOrderByCreatedAtAsc(question);
    }

    public List<Comment> getCommentsByAnswer(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));
        return commentRepository.findByAnswerOrderByCreatedAtAsc(answer);
    }

    public Comment createCommentForQuestion(Long questionId, String content, String username) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setBody(content);
        comment.setQuestion(question);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public Comment createCommentForAnswer(Long answerId, String content, String username) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setBody(content);
        comment.setAnswer(answer);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public Comment updateComment(Long commentId, String content, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setBody(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }
}
