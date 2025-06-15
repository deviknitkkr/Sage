package com.devik.sage.controller;

import com.devik.sage.model.*;
import com.devik.sage.repository.TagRepository;
import com.devik.sage.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final AnswerService answerService;
    private final CommentService commentService;
    private final UserService userService;
    private final TagService tagService;

    @GetMapping
    public String getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        // Get questions page object
        Page<Question> questionsPage = questionService.getAllQuestions(page, size);

        // Add all necessary attributes to the model
        model.addAttribute("questions", questionsPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", questionsPage.getTotalPages());
        model.addAttribute("popularTags", tagService.getPopularTags(size));

        return "questions"; // Change from "index" to "questions" template
    }

    @GetMapping("/ask")
    public String askQuestionForm(Model model) {
        model.addAttribute("question", new Question());
        return "ask-question";
    }

    @PostMapping("/ask")
    public String askQuestion(
            @Valid @ModelAttribute Question question,
            BindingResult result,
            @RequestParam String tags,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {


        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Parse tags and handle database operations
        Set<String> tagSet = Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(tagName -> !tagName.isEmpty())
                .collect(Collectors.toSet());

        questionService.createQuestion(question, tagSet, currentUser);

        return "redirect:/questions/" + question.getId();
    }

    @GetMapping("/{id}")
    public String getQuestion(
            @PathVariable Long id,
            Model model,
            @AuthenticationPrincipal UserDetails userDetails) {

        Question question = questionService.getQuestionById(id);
        List<Answer> answers = answerService.getAnswersByQuestion(id);
        List<Comment> questionComments = commentService.getCommentsByQuestion(id);

        model.addAttribute("question", question);
        model.addAttribute("answers", answers);
        model.addAttribute("questionComments", questionComments);
        model.addAttribute("answer", new Answer());  // For new answer form
        model.addAttribute("comment", new Comment()); // For new comment form

        if (userDetails != null) {
            User currentUser = userService.findByUsername(userDetails.getUsername()).orElse(null);
            model.addAttribute("currentUser", currentUser);
        }

        return "question-detail";
    }

    @GetMapping("/{id}/edit")
    public String editQuestionForm(
            @PathVariable Long id,
            Model model,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionService.getQuestionById(id);

        if (!question.getUser().getId().equals(currentUser.getId())) {
            return "redirect:/questions/" + id + "?error=unauthorized";
        }

        // Convert tags to string
        String tagsString = question.getTags().stream()
                .map(tag -> tag.getName())
                .collect(Collectors.joining(", "));

        model.addAttribute("question", question);
        model.addAttribute("tagsString", tagsString);

        return "edit-question";
    }

    @PostMapping("/{id}/edit")
    public String updateQuestion(
            @PathVariable Long id,
            @Valid @ModelAttribute Question question,
            BindingResult result,
            @RequestParam String tags,
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {

        if (result.hasErrors()) {
            return "edit-question";
        }

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> tagSet = parseTags(tags);

        questionService.updateQuestion(id, question, tagSet, currentUser);

        return "redirect:/questions/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        questionService.deleteQuestion(id, currentUser);

        return "redirect:/questions";
    }

    @GetMapping("/search")
    public String searchQuestions(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        model.addAttribute("questions", questionService.searchQuestions(q, page, size));
        model.addAttribute("searchQuery", q);

        return "search-results";
    }

    @GetMapping("/tagged/{tag}")
    public String getQuestionsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        model.addAttribute("questions", questionService.getQuestionsByTag(tag, page, size));
        model.addAttribute("tag", tag);

        return "tagged-questions";
    }

    private Set<String> parseTags(String tagsString) {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return new HashSet<>();
        }
        return Arrays.stream(tagsString.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toSet());
    }
}
