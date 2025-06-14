package com.devik.sage.controller;

import com.devik.sage.model.User;
import com.devik.sage.service.CommentService;
import com.devik.sage.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    @PostMapping("/question/{questionId}")
    public String addCommentToQuestion(
            @PathVariable Long questionId,
            @Valid @RequestParam String body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        commentService.addCommentToQuestion(questionId, body, currentUser);

        return "redirect:/questions/" + questionId;
    }

    @PostMapping("/answer/{answerId}")
    public String addCommentToAnswer(
            @PathVariable Long answerId,
            @Valid @RequestParam String body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        commentService.addCommentToAnswer(answerId, body, currentUser);

        // Get the question ID to redirect back to the question page
        Long questionId = commentService.getCommentById(answerId).getQuestion().getId();

        return "redirect:/questions/" + questionId;
    }

    @PostMapping("/{id}/delete")
    public String deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        commentService.deleteComment(id, currentUser);

        return "redirect:/questions";
    }
}
