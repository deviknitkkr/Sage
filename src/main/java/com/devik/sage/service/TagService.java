package com.devik.sage.service;

import com.devik.sage.model.Tag;
import com.devik.sage.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getPopularTags(int limit) {
        List<Tag> allPopularTags = tagRepository.findTopTags(limit);
        return allPopularTags;
    }

    public List<Tag> searchTags(String query) {
        return tagRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Integer getQuestionCountForTag(Long tagId) {
        return tagRepository.countQuestionsByTagId(tagId);
    }
}
