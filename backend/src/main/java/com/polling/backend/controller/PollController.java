package com.polling.backend.controller;

import com.polling.backend.dto.ApiResponse;
import com.polling.backend.dto.PollRequest;
import com.polling.backend.dto.VoteRequest;
import com.polling.backend.entity.Poll;
import com.polling.backend.service.PollService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
public class PollController {

    private final PollService pollService;

    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping
    public ResponseEntity<Page<Poll>> getAllPolls(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(pollService.getAllPolls(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poll> getPollById(@PathVariable Long id) {
        return ResponseEntity.ok(pollService.getPollById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Poll> createPoll(@RequestBody PollRequest pollRequest) {
        String username = getUsername();
        return ResponseEntity.ok(pollService.createPoll(pollRequest, username));
    }

    @PostMapping("/{id}/vote")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> castVote(@PathVariable Long id, @RequestBody VoteRequest voteRequest) {
        String username = getUsername();
        ApiResponse response = pollService.castVote(id, voteRequest, username);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deletePoll(@PathVariable Long id) {
        pollService.deletePoll(id);
        return ResponseEntity.ok(new ApiResponse(true, "Poll deleted successfully"));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> disablePoll(@PathVariable Long id) {
        pollService.disablePoll(id);
        return ResponseEntity.ok(new ApiResponse(true, "Poll disabled successfully"));
    }

    private String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
