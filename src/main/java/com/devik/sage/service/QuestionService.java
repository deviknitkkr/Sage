package com.devik.sage.service;

import com.devik.sage.model.Question;
import com.devik.sage.model.Tag;
import com.devik.sage.model.User;
import com.devik.sage.repository.QuestionRepository;
import com.devik.sage.repository.TagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final TagRepository tagRepository;

    public Page<Question> getAllQuestions(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            return questionRepository.findAll(pageable);
        } catch (Exception e) {
            // Return empty page if there's an error or no questions
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), 0);
        }
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + id));
    }

    @Transactional
    public Question createQuestion(Question question, Set<String> tagNames, User currentUser) {
        question.setUser(currentUser);

        // Process tags
        Set<Tag> tags = processTags(tagNames);
        question.setTags(tags);

        return questionRepository.save(question);
    }

    @Transactional
    public Question updateQuestion(Long questionId, Question updatedQuestion, Set<String> tagNames, User currentUser) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this question");
        }

        question.setTitle(updatedQuestion.getTitle());
        question.setBody(updatedQuestion.getBody());

        // Process tags
        Set<Tag> tags = processTags(tagNames);
        question.setTags(tags);

        return questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestion(Long questionId, User currentUser) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this question");
        }

        questionRepository.delete(question);
    }

    private Set<Tag> processTags(Set<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }

        return tagNames.stream()
                .map(name -> name.toLowerCase().trim())
                .filter(name -> !name.isEmpty())
                .map(name -> {
                    // Find or create tag
                    return tagRepository.findByNameIgnoreCase(name)
                            .orElseGet(() -> {
                                Tag newTag = new Tag();
                                newTag.setName(name);
                                return tagRepository.save(newTag);
                            });
                })
                .collect(Collectors.toSet());
    }

    public Page<Question> searchQuestions(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionRepository.searchQuestions(query, pageable);
    }

    public Page<Question> getQuestionsByTag(String tagName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionRepository.findByTagNameContaining(tagName, pageable);
    }
}
