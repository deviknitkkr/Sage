package com.devik.sage.controller;

import com.devik.sage.dto.UserProfileResponse;
import com.devik.sage.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/{username}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String username) {
        Optional<UserProfileResponse> profile = userProfileService.getUserProfile(username);

        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile.get());
    }

    @PutMapping("/{username}/profile")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable String username,
            @RequestBody UpdateProfileRequest request) {

        try {
            userProfileService.updateUserProfile(username, request.getBio(),
                    request.getLocation(), request.getWebsite());
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Inner class for update request
    public static class UpdateProfileRequest {
        private String bio;
        private String location;
        private String website;

        // Getters and setters
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
    }
}
