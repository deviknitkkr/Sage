package com.devik.sage.controller;

import com.devik.sage.dto.TagResponse;
import com.devik.sage.model.Tag;
import com.devik.sage.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<Tag> allTags = tagService.getAllTags();
        List<TagResponse> responses = allTags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<TagResponse>> getPopularTags(@RequestParam(defaultValue = "10") int limit) {
        List<Tag> popularTags = tagService.getPopularTags(limit);
        List<TagResponse> responses = popularTags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TagResponse>> searchTags(@RequestParam String query) {
        List<Tag> tags = tagService.searchTags(query);
        List<TagResponse> responses = tags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private TagResponse convertToResponse(Tag tag) {
        TagResponse response = new TagResponse();
        response.setId(tag.getId());
        response.setName(tag.getName());
        response.setDescription(tag.getDescription());
        // Use the count from the service instead of accessing the lazy collection
        response.setQuestionCount(tagService.getQuestionCountForTag(tag.getId()));
        return response;
    }
}
