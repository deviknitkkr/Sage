package com.devik.sage.service;

import com.devik.sage.model.Tag;
import com.devik.sage.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public List<Tag> getPopularTags(int limit) {
        try {
            return tagRepository.findTopTags(limit);
        } catch (Exception e) {
            // Return empty list if there are no tags or an error occurs
            return new ArrayList<>();
        }
    }

    public Tag getTagByName(String name) {
        return tagRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Tag not found: " + name));
    }

    public List<Tag> searchTags(String query) {
        return tagRepository.findByNameContainingIgnoreCase(query);
    }

    public Optional<Tag> findTagByName(String name) {
        return tagRepository.findByNameIgnoreCase(name);
    }

    public void saveTag(Tag tag) {
        tagRepository.save(tag);
    }

    public boolean tagExists(String name) {
        return tagRepository.existsByNameIgnoreCase(name);
    }
}
