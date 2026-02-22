package com.polling.backend.service;

import com.polling.backend.entity.Poll;
import com.polling.backend.entity.PollStatus;
import com.polling.backend.repository.PollRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
public class PollSchedulerService {

    private static final Logger logger = Logger.getLogger(PollSchedulerService.class.getName());

    private final PollRepository pollRepository;

    public PollSchedulerService(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    /**
     * Runs every 60 seconds (60000 milliseconds)
     * Checks for polls where expiryDate has passed and status is still ACTIVE.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void closeExpiredPolls() {
        LocalDateTime now = LocalDateTime.now();
        List<Poll> expiredActivePolls = pollRepository.findByStatusAndExpiryDateBefore(PollStatus.ACTIVE, now);

        if (!expiredActivePolls.isEmpty()) {
            logger.info("Found " + expiredActivePolls.size() + " expired polls. Closing them now.");
            for (Poll poll : expiredActivePolls) {
                poll.setStatus(PollStatus.CLOSED);
                // The transaction will automatically save these changes to the DB when the
                // method completes
            }
            // For batch saving: pollRepository.saveAll(expiredActivePolls);
        }
    }
}
