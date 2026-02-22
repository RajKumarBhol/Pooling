package com.polling.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "poll_id" })
})
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "option_id", nullable = false)
    private Option option;

    public Vote() {
    }

    public Vote(Long id, User user, Poll poll, Option option) {
        this.id = id;
        this.user = user;
        this.poll = poll;
        this.option = option;
    }

    public static VoteBuilder builder() {
        return new VoteBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Poll getPoll() {
        return poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public Option getOption() {
        return option;
    }

    public void setOption(Option option) {
        this.option = option;
    }

    public static class VoteBuilder {
        private Long id;
        private User user;
        private Poll poll;
        private Option option;

        public VoteBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public VoteBuilder user(User user) {
            this.user = user;
            return this;
        }

        public VoteBuilder poll(Poll poll) {
            this.poll = poll;
            return this;
        }

        public VoteBuilder option(Option option) {
            this.option = option;
            return this;
        }

        public Vote build() {
            return new Vote(id, user, poll, option);
        }
    }
}
