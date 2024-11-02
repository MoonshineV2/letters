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

        if (participant.getInitials() == null || participant.getInitials().isEmpty()) {
            throw new RuntimeException("Фамилия, инициалы не заданы");
        }

        if (participant.getPost() == null || participant.getPost().isEmpty()) {
            throw new RuntimeException("Должность не задана");
        }

        return participantRepository.create(participant);
    }
}
