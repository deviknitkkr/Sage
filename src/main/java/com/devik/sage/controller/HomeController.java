package com.devik.sage.controller;

import com.devik.sage.model.Question;
import com.devik.sage.model.Tag;
import com.devik.sage.service.QuestionService;
import com.devik.sage.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final QuestionService questionService;
    private final TagService tagService;

    @GetMapping("/")
    public String home(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        Page<Question> questions = questionService.getAllQuestions(page, size);
        List<Tag> popularTags = tagService.getPopularTags(10);

        model.addAttribute("questions", questions.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", questions.getTotalPages());
        model.addAttribute("popularTags", popularTags);

        return "index";
    }

    @GetMapping("/search")
    public String search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        Page<Question> questions = questionService.searchQuestions(query, page, size);

        model.addAttribute("questions", questions.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", questions.getTotalPages());
        model.addAttribute("query", query);

        return "search-results";
    }
}
