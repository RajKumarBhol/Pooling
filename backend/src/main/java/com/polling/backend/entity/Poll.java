package com.polling.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "polls")
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    private PollStatus status;

    private LocalDateTime expiryDate;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>();

    public Poll() {
    }

    public Poll(Long id, String title, User createdBy, PollStatus status, LocalDateTime expiryDate,
            LocalDateTime createdAt, List<Option> options) {
        this.id = id;
        this.title = title;
        this.createdBy = createdBy;
        this.status = status;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.options = options != null ? options : new ArrayList<>();
    }

    public static PollBuilder builder() {
        return new PollBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public PollStatus getStatus() {
        return status;
    }

    public void setStatus(PollStatus status) {
        this.status = status;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public static class PollBuilder {
        private Long id;
        private String title;
        private User createdBy;
        private PollStatus status;
        private LocalDateTime expiryDate;
        private LocalDateTime createdAt;
        private List<Option> options = new ArrayList<>();

        public PollBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PollBuilder title(String title) {
            this.title = title;
            return this;
        }

        public PollBuilder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public PollBuilder status(PollStatus status) {
            this.status = status;
            return this;
        }

        public PollBuilder expiryDate(LocalDateTime expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public PollBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PollBuilder options(List<Option> options) {
            this.options = options;
            return this;
        }

        public Poll build() {
            return new Poll(id, title, createdBy, status, expiryDate, createdAt, options);
        }
    }
}
