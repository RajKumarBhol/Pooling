package com.polling.backend.service;

import com.polling.backend.dto.UserProfileResponse;
import com.polling.backend.dto.UserVotedPollResponse;
import com.polling.backend.entity.Poll;
import com.polling.backend.entity.User;
import com.polling.backend.entity.Vote;
import com.polling.backend.repository.PollRepository;
import com.polling.backend.repository.UserRepository;
import com.polling.backend.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PollRepository pollRepository;
    private final VoteRepository voteRepository;

    public UserService(UserRepository userRepository, PollRepository pollRepository, VoteRepository voteRepository) {
        this.userRepository = userRepository;
        this.pollRepository = pollRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Poll> createdPolls = pollRepository.findByCreatedByOrderByIdDesc(user);

        List<Vote> votes = voteRepository.findByUserOrderByIdDesc(user);
        List<UserVotedPollResponse> votedPolls = votes.stream()
                .map(vote -> new UserVotedPollResponse(vote.getPoll(), vote.getOption().getOptionText()))
                .collect(Collectors.toList());

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                createdPolls,
                votedPolls);
    }
}
