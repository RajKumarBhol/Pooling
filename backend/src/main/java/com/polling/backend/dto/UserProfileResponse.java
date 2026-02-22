package com.polling.backend.dto;

import com.polling.backend.entity.Poll;
import java.util.List;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private List<Poll> createdPolls;
    private List<UserVotedPollResponse> votedPolls;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String name, String email, String role, List<Poll> createdPolls,
            List<UserVotedPollResponse> votedPolls) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdPolls = createdPolls;
        this.votedPolls = votedPolls;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Poll> getCreatedPolls() {
        return createdPolls;
    }

    public void setCreatedPolls(List<Poll> createdPolls) {
        this.createdPolls = createdPolls;
    }

    public List<UserVotedPollResponse> getVotedPolls() {
        return votedPolls;
    }

    public void setVotedPolls(List<UserVotedPollResponse> votedPolls) {
        this.votedPolls = votedPolls;
    }
}
