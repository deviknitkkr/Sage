package com.devik.sage.controller;

import com.devik.sage.dto.AnswerRequest;
import com.devik.sage.dto.AnswerResponse;
import com.devik.sage.dto.PageResponse;
import com.devik.sage.model.Answer;
import com.devik.sage.model.User;
import com.devik.sage.service.AnswerService;
import com.devik.sage.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions/{questionId}/answers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnswerController {

    private final AnswerService answerService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<PageResponse<AnswerResponse>> getAnswers(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Page<Answer> answerPage = answerService.getAnswersByQuestionId(questionId, page, size);

        PageResponse<AnswerResponse> response = new PageResponse<>();
        response.setContent(answerPage.getContent().stream()
                .map(answer -> convertToResponse(answer, userDetails))
                .collect(Collectors.toList()));
        response.setPage(answerPage.getNumber());
        response.setSize(answerPage.getSize());
        response.setTotalElements(answerPage.getTotalElements());
        response.setTotalPages(answerPage.getTotalPages());
        response.setFirst(answerPage.isFirst());
        response.setLast(answerPage.isLast());
        response.setEmpty(answerPage.isEmpty());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<AnswerResponse> createAnswer(
            @PathVariable Long questionId,
            @RequestBody AnswerRequest answerRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Answer answer = answerService.createAnswer(answerRequest.getContent(), questionId, user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToResponse(answer, userDetails));
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<AnswerResponse> updateAnswer(
            @PathVariable Long questionId,
            @PathVariable Long answerId,
            @RequestBody AnswerRequest answerRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Answer answer = answerService.updateAnswer(answerId, answerRequest.getContent(), user);

        return ResponseEntity.ok(convertToResponse(answer, userDetails));
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> deleteAnswer(
            @PathVariable Long questionId,
            @PathVariable Long answerId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        answerService.deleteAnswer(answerId, user);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{answerId}/accept")
    public ResponseEntity<AnswerResponse> acceptAnswer(
            @PathVariable Long questionId,
            @PathVariable Long answerId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Answer answer = answerService.acceptAnswer(answerId, user);

        return ResponseEntity.ok(convertToResponse(answer, userDetails));
    }

    @PostMapping("/{answerId}/votes")
    public ResponseEntity<AnswerResponse> voteOnAnswer(
            @PathVariable Long questionId,
            @PathVariable Long answerId,
            @RequestBody VoteRequest voteRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // For now, just return the answer without voting functionality
        // TODO: Implement voting in AnswerService
        Answer answer = answerService.getAnswerById(answerId);

        return ResponseEntity.ok(convertToResponse(answer, userDetails));
    }

    private AnswerResponse convertToResponse(Answer answer, UserDetails userDetails) {
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
        response.setAuthor(userDetails != null && userDetails.getUsername().equals(answer.getUser().getUsername()));

        return response;
    }

    @Data
    public static class VoteRequest {
        private String vote;
    }
}
