package com.polling.backend.dto;

public class VoteRequest {
    private Long optionId;

    public VoteRequest() {
    }

    public VoteRequest(Long optionId) {
        this.optionId = optionId;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }
}
