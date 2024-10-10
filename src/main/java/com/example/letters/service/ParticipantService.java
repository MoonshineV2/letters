package com.example.letters.service;

import com.example.letters.model.Participant;
import com.example.letters.repository.ParticipantRepository;
import com.example.letters.repository.WorkerRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;

@Model
public class ParticipantService {

    @Inject
    private ParticipantRepository participantRepository;

    public List<Participant> findAll() {
        return participantRepository.findAll();
    }

    public List<Participant> findSigners() {
        return participantRepository.findSigners();
    }

    public Participant create(Participant participant) {

        if (participant.getFullName() == null || participant.getFullName().isEmpty()) {
            throw new RuntimeException("Полное имя не задано");
        }
        if (participant.getInitials() == null || participant.getInitials().isEmpty()) {
            throw new RuntimeException("Инициалы не заданы");
        }

        return participantRepository.create(participant);
    }
}
