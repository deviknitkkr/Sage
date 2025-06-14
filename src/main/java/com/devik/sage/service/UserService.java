package com.devik.sage.service;

import com.devik.sage.model.User;
import com.devik.sage.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public User registerUser(User user) {
        if (isUsernameExists(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (isEmailExists(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User updateProfile(User currentUser, User updatedUser) {
        currentUser.setDisplayName(updatedUser.getDisplayName());

        if (updatedUser.getProfileImageUrl() != null && !updatedUser.getProfileImageUrl().isEmpty()) {
            currentUser.setProfileImageUrl(updatedUser.getProfileImageUrl());
        }

        return userRepository.save(currentUser);
    }
}
