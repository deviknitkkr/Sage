package com.devik.sage.repository;

import com.devik.sage.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNameIgnoreCase(String name);
    List<Tag> findByNameContainingIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.questions) DESC")
    List<Tag> findPopularTags();

    @Query(value = "SELECT t.* FROM tags t JOIN question_tags qt ON t.id = qt.tag_id " +
           "GROUP BY t.id ORDER BY COUNT(qt.question_id) DESC LIMIT ?1", nativeQuery = true)
    List<Tag> findTopTags(int limit);
}
