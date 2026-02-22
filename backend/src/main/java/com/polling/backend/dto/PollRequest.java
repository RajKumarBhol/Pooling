package com.polling.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PollRequest {
    private String title;
    private List<String> options;
    private LocalDateTime expiryDate;

    public PollRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
