package com.polling.backend.dto;

public class OptionVoteUpdate {
    private Long optionId;
    private int voteCount;

    public OptionVoteUpdate() {
    }

    public OptionVoteUpdate(Long optionId, int voteCount) {
        this.optionId = optionId;
        this.voteCount = voteCount;
    }

    public static OptionVoteUpdateBuilder builder() {
        return new OptionVoteUpdateBuilder();
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public static class OptionVoteUpdateBuilder {
        private Long optionId;
        private int voteCount;

        public OptionVoteUpdateBuilder optionId(Long optionId) {
            this.optionId = optionId;
            return this;
        }

        public OptionVoteUpdateBuilder voteCount(int voteCount) {
            this.voteCount = voteCount;
            return this;
        }

        public OptionVoteUpdate build() {
            return new OptionVoteUpdate(optionId, voteCount);
        }
    }
}
