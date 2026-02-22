package com.polling.backend.service;

import com.polling.backend.dto.OptionVoteUpdate;
import com.polling.backend.entity.Option;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastVoteUpdate(Long pollId, Option option) {
        OptionVoteUpdate update = OptionVoteUpdate.builder()
                .optionId(option.getId())
                .voteCount(option.getVoteCount())
                .build();

        messagingTemplate.convertAndSend("/topic/polls/" + pollId, update);
    }
}
