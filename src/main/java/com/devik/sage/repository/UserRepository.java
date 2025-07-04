package com.devik.sage.repository;

import com.devik.sage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.user.id = :userId")
    long countQuestionsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.user.id = :userId")
    long countAnswersByUserId(@Param("userId") Long userId);
}
