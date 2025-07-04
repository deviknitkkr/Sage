package com.devik.sage.service;

import com.devik.sage.model.Question;
import com.devik.sage.model.Tag;
import com.devik.sage.model.User;
import com.devik.sage.repository.QuestionRepository;
import com.devik.sage.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TagRepository tagRepository;

    public Page<Question> getAllQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findAll(pageable);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question createQuestion(Question question, Set<String> tagNames, User user) {
        question.setUser(user);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());

        // Handle tags
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName);
                        return tagRepository.save(newTag);
                    });
            tags.add(tag);
        }
        question.setTags(tags);

        return questionRepository.save(question);
    }

    public Page<Question> searchQuestions(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
                query, query, pageable);
    }

    public Page<Question> getQuestionsByTag(String tagName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByTagsName(tagName, pageable);
    }

    public Long getAnswerCountByQuestionId(Long questionId) {
        return questionRepository.countAnswersByQuestionId(questionId);
    }

    public Question updateQuestion(Long id, Question updatedQuestion, User user) {
        Question existing = getQuestionById(id);
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own questions");
        }

        existing.setTitle(updatedQuestion.getTitle());
        existing.setBody(updatedQuestion.getBody());
        existing.setUpdatedAt(LocalDateTime.now());

        return questionRepository.save(existing);
    }

    public void deleteQuestion(Long id, User user) {
        Question existing = getQuestionById(id);
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own questions");
        }
        questionRepository.delete(existing);
    }

    public void incrementViewCount(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.incrementViewCount();
        questionRepository.save(question);
    }
}
