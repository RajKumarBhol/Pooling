package com.polling.backend.service;

import com.polling.backend.dto.ApiResponse;
import com.polling.backend.dto.PollRequest;
import com.polling.backend.dto.VoteRequest;
import com.polling.backend.entity.Option;
import com.polling.backend.entity.Poll;
import com.polling.backend.entity.PollStatus;
import com.polling.backend.entity.User;
import com.polling.backend.entity.Vote;
import com.polling.backend.repository.OptionRepository;
import com.polling.backend.repository.PollRepository;
import com.polling.backend.repository.UserRepository;
import com.polling.backend.repository.VoteRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PollService {

    private final PollRepository pollRepository;
    private final OptionRepository optionRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    public PollService(PollRepository pollRepository, OptionRepository optionRepository, VoteRepository voteRepository,
            UserRepository userRepository, WebSocketService webSocketService) {
        this.pollRepository = pollRepository;
        this.optionRepository = optionRepository;
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
    }

    public Page<Poll> getAllPolls(String searchKeyword, Pageable pageable) {
        if (searchKeyword != null && !searchKeyword.trim().isEmpty()) {
            return pollRepository.findByTitleContainingIgnoreCase(searchKeyword, pageable);
        }
        return pollRepository.findAll(pageable);
    }

    public Poll getPollById(Long pollId) {
        return pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found with id: " + pollId));
    }

    @Transactional
    public Poll createPoll(PollRequest pollRequest, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Poll poll = Poll.builder()
                .title(pollRequest.getTitle())
                .createdBy(user)
                .status(PollStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .expiryDate(pollRequest.getExpiryDate())
                .build();

        Poll savedPoll = pollRepository.save(poll);

        for (String optionText : pollRequest.getOptions()) {
            Option option = Option.builder()
                    .poll(savedPoll)
                    .optionText(optionText)
                    .voteCount(0)
                    .build();
            savedPoll.getOptions().add(option);
        }

        return pollRepository.save(savedPoll);
    }

    @Transactional
    public void disablePoll(Long pollId) {
        Poll poll = getPollById(pollId);
        poll.setStatus(PollStatus.CLOSED);
        pollRepository.save(poll);
    }

    @Transactional
    public void deletePoll(Long pollId) {
        pollRepository.deleteById(pollId);
    }

    @Transactional
    public ApiResponse castVote(Long pollId, VoteRequest voteRequest, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Poll poll = getPollById(pollId);

        if (poll.getStatus() == PollStatus.CLOSED ||
                (poll.getExpiryDate() != null && poll.getExpiryDate().isBefore(LocalDateTime.now()))) {
            return new ApiResponse(false, "Poll is closed or expired.");
        }

        if (voteRepository.existsByUserIdAndPollId(user.getId(), pollId)) {
            return new ApiResponse(false, "You have already voted on this poll.");
        }

        Option option = optionRepository.findById(voteRequest.getOptionId())
                .orElseThrow(() -> new RuntimeException("Option not found"));

        if (!option.getPoll().getId().equals(pollId)) {
            return new ApiResponse(false, "Invalid option for this poll.");
        }

        Vote vote = Vote.builder()
                .user(user)
                .poll(poll)
                .option(option)
                .build();
        voteRepository.save(vote);

        option.setVoteCount(option.getVoteCount() + 1);
        optionRepository.save(option);

        // Broadcast to WebSocket clients
        webSocketService.broadcastVoteUpdate(pollId, option);

        return new ApiResponse(true, "Vote cast successfully.");
    }
}
