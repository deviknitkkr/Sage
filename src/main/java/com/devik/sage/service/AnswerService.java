package com.devik.sage.service;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.repository.AnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionService questionService;

    public Page<Answer> getAnswersByQuestionId(Long questionId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return answerRepository.findByQuestionId(questionId, pageable);
    }

    public Answer getAnswerById(Long id) {
        return answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
    }

    public Answer createAnswer(String content, Long questionId, User user) {
        Question question = questionService.getQuestionById(questionId);

        Answer answer = new Answer();
        answer.setBody(content);
        answer.setQuestion(question);
        answer.setUser(user);
        answer.setCreatedAt(LocalDateTime.now());
        answer.setUpdatedAt(LocalDateTime.now());
        answer.setAccepted(false);

        return answerRepository.save(answer);
    }

    public Answer updateAnswer(Long id, String content, User user) {
        Answer existing = getAnswerById(id);

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own answers");
        }

        existing.setBody(content);
        existing.setUpdatedAt(LocalDateTime.now());

        return answerRepository.save(existing);
    }

    public void deleteAnswer(Long id, User user) {
        Answer existing = getAnswerById(id);

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own answers");
        }

        answerRepository.delete(existing);
    }

    public Answer acceptAnswer(Long id, User user) {
        Answer answer = getAnswerById(id);
        Question question = answer.getQuestion();

        // Only question author can accept answers
        if (!question.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Only the question author can accept answers");
        }

        // Unaccept any previously accepted answer for this question
        answerRepository.findByQuestionIdAndAcceptedTrue(question.getId())
                .ifPresent(acceptedAnswer -> {
                    acceptedAnswer.setAccepted(false);
                    answerRepository.save(acceptedAnswer);
                });

        // Accept this answer
        answer.setAccepted(true);
        answer.setUpdatedAt(LocalDateTime.now());

        return answerRepository.save(answer);
    }
}
