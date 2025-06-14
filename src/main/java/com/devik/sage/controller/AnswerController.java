package com.devik.sage.controller;

import com.devik.sage.model.Answer;
import com.devik.sage.model.User;
import com.devik.sage.service.AnswerService;
import com.devik.sage.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;
    private final UserService userService;

    @PostMapping("/question/{questionId}")
    public String addAnswer(
            @PathVariable Long questionId,
            @Valid @RequestParam String body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        answerService.createAnswer(questionId, body, currentUser);

        return "redirect:/questions/" + questionId;
    }

    @GetMapping("/{id}/edit")
    public String editAnswerForm(
            @PathVariable Long id,
            Model model,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerService.getAnswerById(id);

        if (!answer.getUser().getId().equals(currentUser.getId())) {
            return "redirect:/questions/" + answer.getQuestion().getId() + "?error=unauthorized";
        }

        model.addAttribute("answer", answer);

        return "edit-answer";
    }

    @PostMapping("/{id}/edit")
    public String updateAnswer(
            @PathVariable Long id,
            @Valid @RequestParam String body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer updatedAnswer = answerService.updateAnswer(id, body, currentUser);

        return "redirect:/questions/" + updatedAnswer.getQuestion().getId();
    }

    @PostMapping("/{id}/delete")
    public String deleteAnswer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerService.getAnswerById(id);
        Long questionId = answer.getQuestion().getId();

        answerService.deleteAnswer(id, currentUser);

        return "redirect:/questions/" + questionId;
    }

    @PostMapping("/{id}/accept")
    public String acceptAnswer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerService.acceptAnswer(id, currentUser);

        return "redirect:/questions/" + answer.getQuestion().getId();
    }
}
