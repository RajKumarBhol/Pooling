package com.polling.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    @JsonIgnore
    private Poll poll;

    @NotBlank
    private String optionText;

    private int voteCount = 0;

    public Option() {
    }

    public Option(Long id, Poll poll, String optionText, int voteCount) {
        this.id = id;
        this.poll = poll;
        this.optionText = optionText;
        this.voteCount = voteCount;
    }

    public static OptionBuilder builder() {
        return new OptionBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public static class OptionBuilder {
        private Long id;
        private Poll poll;
        private String optionText;
        private int voteCount = 0;

        public OptionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public OptionBuilder poll(Poll poll) {
            this.poll = poll;
            return this;
        }

        public OptionBuilder optionText(String optionText) {
            this.optionText = optionText;
            return this;
        }

        public OptionBuilder voteCount(int voteCount) {
            this.voteCount = voteCount;
            return this;
        }

        public Option build() {
            return new Option(id, poll, optionText, voteCount);
        }
    }
}
