package com.devik.sage.service;

import com.devik.sage.model.Answer;
import com.devik.sage.model.Question;
import com.devik.sage.model.User;
import com.devik.sage.repository.AnswerRepository;
import com.devik.sage.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public List<Answer> getAnswersByQuestion(Long questionId) {
        return answerRepository.findByQuestionIdOrderByAcceptedDescUpvoteCountDescCreatedAtDesc(questionId);
    }

    public Answer getAnswerById(Long answerId) {
        return answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found with ID: " + answerId));
    }

    @Transactional
    public Answer createAnswer(Long questionId, String body, User currentUser) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setBody(body);
        answer.setQuestion(question);
        answer.setUser(currentUser);

        return answerRepository.save(answer);
    }

    @Transactional
    public Answer updateAnswer(Long answerId, String body, User currentUser) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this answer");
        }

        answer.setBody(body);
        return answerRepository.save(answer);
    }

    @Transactional
    public void deleteAnswer(Long answerId, User currentUser) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this answer");
        }

        answerRepository.delete(answer);
    }

    @Transactional
    public Answer acceptAnswer(Long answerId, User currentUser) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Question question = answer.getQuestion();

        if (!question.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the question owner can accept an answer");
        }

        // Reset all answers to not accepted first
        answerRepository.findByQuestionOrderByCreatedAtDesc(question).forEach(a -> a.setAccepted(false));

        // Set this answer as accepted
        answer.setAccepted(true);
        return answerRepository.save(answer);
    }
}
