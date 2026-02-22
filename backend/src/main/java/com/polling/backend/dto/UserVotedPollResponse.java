package com.polling.backend.dto;

import com.polling.backend.entity.Poll;

public class UserVotedPollResponse {
    private Poll poll;
    private String selectedOptionText;

    public UserVotedPollResponse() {
    }

    public UserVotedPollResponse(Poll poll, String selectedOptionText) {
        this.poll = poll;
        this.selectedOptionText = selectedOptionText;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public String getSelectedOptionText() {
        return selectedOptionText;
    }

    public void setSelectedOptionText(String selectedOptionText) {
        this.selectedOptionText = selectedOptionText;
    }
}
