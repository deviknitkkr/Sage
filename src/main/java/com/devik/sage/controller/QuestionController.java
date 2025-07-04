package com.devik.sage.controller;

import com.devik.sage.dto.QuestionRequest;
import com.devik.sage.dto.QuestionResponse;
import com.devik.sage.dto.PageResponse;
import com.devik.sage.dto.AnswerResponse;
import com.devik.sage.dto.QuestionWithAnswersResponse;
import com.devik.sage.model.Question;
import com.devik.sage.model.Answer;
import com.devik.sage.model.User;
import com.devik.sage.service.QuestionService;
import com.devik.sage.service.AnswerService;
import com.devik.sage.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionService questionService;
    private final UserService userService;
    private final AnswerService answerService;

    @GetMapping("/public")
    public ResponseEntity<PageResponse<QuestionResponse>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Question> questionPage = questionService.getAllQuestions(page, size);

        PageResponse<QuestionResponse> response = new PageResponse<>();
        response.setContent(questionPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList()));
        response.setPage(questionPage.getNumber());
        response.setSize(questionPage.getSize());
        response.setTotalElements(questionPage.getTotalElements());
        response.setTotalPages(questionPage.getTotalPages());
        response.setFirst(questionPage.isFirst());
        response.setLast(questionPage.isLast());
        response.setEmpty(questionPage.isEmpty());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Long id) {
        try {
            // Automatically increment view count when question is fetched
            questionService.incrementViewCount(id);
            // Get the question with updated view count
            Question question = questionService.getQuestionById(id);
            return ResponseEntity.ok(convertToResponse(question));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Question question = new Question();
            question.setTitle(request.getTitle());
            question.setBody(request.getContent());

            Set<String> tagNames = new HashSet<>();
            if (request.getTags() != null && !request.getTags().trim().isEmpty()) {
                tagNames = new HashSet<>(Arrays.asList(request.getTags().split(",")));
                tagNames.removeIf(String::isEmpty);
            }

            Question savedQuestion = questionService.createQuestion(question, tagNames, user);
            return ResponseEntity.ok(convertToResponse(savedQuestion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Question updatedQuestion = new Question();
            updatedQuestion.setTitle(request.getTitle());
            updatedQuestion.setBody(request.getContent());

            Question result = questionService.updateQuestion(id, updatedQuestion, user);
            return ResponseEntity.ok(convertToResponse(result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            questionService.deleteQuestion(id, user);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<QuestionResponse>> searchQuestions(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Question> questionPage = questionService.searchQuestions(q, page, size);

        PageResponse<QuestionResponse> response = new PageResponse<>();
        response.setContent(questionPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList()));
        response.setPage(questionPage.getNumber());
        response.setSize(questionPage.getSize());
        response.setTotalElements(questionPage.getTotalElements());
        response.setTotalPages(questionPage.getTotalPages());
        response.setFirst(questionPage.isFirst());
        response.setLast(questionPage.isLast());
        response.setEmpty(questionPage.isEmpty());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tagged/{tag}")
    public ResponseEntity<PageResponse<QuestionResponse>> getQuestionsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Question> questionPage = questionService.getQuestionsByTag(tag, page, size);

        PageResponse<QuestionResponse> response = new PageResponse<>();
        response.setContent(questionPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList()));
        response.setPage(questionPage.getNumber());
        response.setSize(questionPage.getSize());
        response.setTotalElements(questionPage.getTotalElements());
        response.setTotalPages(questionPage.getTotalPages());
        response.setFirst(questionPage.isFirst());
        response.setLast(questionPage.isLast());
        response.setEmpty(questionPage.isEmpty());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/with-answers")
    public ResponseEntity<QuestionWithAnswersResponse> getQuestionWithAnswers(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            questionService.incrementViewCount(id);
            Question question = questionService.getQuestionById(id);
            QuestionResponse questionResponse = convertToResponse(question);

            // Get answers for this question
            Page<Answer> answerPage = answerService.getAnswersByQuestionId(id, page, size);
            PageResponse<AnswerResponse> answersResponse = new PageResponse<>();
            answersResponse.setContent(answerPage.getContent().stream()
                    .map(answer -> convertAnswerToResponse(answer, userDetails))
                    .collect(Collectors.toList()));
            answersResponse.setPage(answerPage.getNumber());
            answersResponse.setSize(answerPage.getSize());
            answersResponse.setTotalElements(answerPage.getTotalElements());
            answersResponse.setTotalPages(answerPage.getTotalPages());
            answersResponse.setFirst(answerPage.isFirst());
            answersResponse.setLast(answerPage.isLast());
            answersResponse.setEmpty(answerPage.isEmpty());

            QuestionWithAnswersResponse response = new QuestionWithAnswersResponse();
            response.setQuestion(questionResponse);
            response.setAnswers(answersResponse);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private QuestionResponse convertToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setTitle(question.getTitle());
        response.setContent(question.getBody());
        response.setAuthorUsername(question.getUser().getUsername());
        response.setCreatedAt(question.getCreatedAt());
        response.setUpdatedAt(question.getUpdatedAt());
        response.setViewCount(question.getViewCount());

        // Safely handle tags to avoid lazy loading issues
        response.setTags(question.getTags().stream()
                .map(tag -> tag.getName())
                .collect(Collectors.toList()));

        // Get answer count efficiently
        response.setAnswerCount(questionService.getAnswerCountByQuestionId(question.getId()));

        return response;
    }

    private AnswerResponse convertAnswerToResponse(Answer answer, UserDetails currentUser) {
        AnswerResponse response = new AnswerResponse();
        response.setId(answer.getId());
        response.setContent(answer.getBody());
        response.setAuthorUsername(answer.getUser().getUsername());
        response.setAuthorId(answer.getUser().getId());
        response.setQuestionId(answer.getQuestion().getId());
        response.setCreatedAt(answer.getCreatedAt());
        response.setUpdatedAt(answer.getUpdatedAt());
        response.setAccepted(answer.isAccepted());
        response.setUpvoteCount(answer.getUpvoteCount());
        response.setDownvoteCount(answer.getDownvoteCount());
        response.setTotalVotes(answer.getUpvoteCount() - answer.getDownvoteCount());

        boolean isAuthor = currentUser != null &&
                          currentUser.getUsername().equals(answer.getUser().getUsername());
        response.setAuthor(isAuthor);

        return response;
    }
}
