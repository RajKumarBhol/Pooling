package com.polling.backend.repository;

import com.polling.backend.entity.User;
import com.polling.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByUserIdAndPollId(Long userId, Long pollId);

    List<Vote> findByUserOrderByIdDesc(User user);
}
