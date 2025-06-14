package com.devik.sage.controller;

import com.devik.sage.model.User;
import com.devik.sage.model.Vote;
import com.devik.sage.service.UserService;
import com.devik.sage.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;
    private final UserService userService;

    @PostMapping("/question/{id}/upvote")
    @ResponseBody
    public ResponseEntity<?> upvoteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vote vote = voteService.voteQuestion(id, currentUser, Vote.VoteType.UPVOTE);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("voteStatus", vote != null ? vote.getVoteType().toString() : "NONE");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/question/{id}/downvote")
    @ResponseBody
    public ResponseEntity<?> downvoteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vote vote = voteService.voteQuestion(id, currentUser, Vote.VoteType.DOWNVOTE);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("voteStatus", vote != null ? vote.getVoteType().toString() : "NONE");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/answer/{id}/upvote")
    @ResponseBody
    public ResponseEntity<?> upvoteAnswer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vote vote = voteService.voteAnswer(id, currentUser, Vote.VoteType.UPVOTE);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("voteStatus", vote != null ? vote.getVoteType().toString() : "NONE");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/answer/{id}/downvote")
    @ResponseBody
    public ResponseEntity<?> downvoteAnswer(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vote vote = voteService.voteAnswer(id, currentUser, Vote.VoteType.DOWNVOTE);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("voteStatus", vote != null ? vote.getVoteType().toString() : "NONE");

        return ResponseEntity.ok(response);
    }
}
