package com.polling.backend.repository;

import com.polling.backend.entity.Poll;
import com.polling.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByCreatedByOrderByIdDesc(User user);

    // For pagination and search
    Page<Poll> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // For scheduled auto-expiration
    List<Poll> findByStatusAndExpiryDateBefore(com.polling.backend.entity.PollStatus status,
            java.time.LocalDateTime date);
}
