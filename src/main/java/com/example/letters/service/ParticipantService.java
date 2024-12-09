package com.example.letters.service;

import com.example.letters.model.Participant;
import com.example.letters.repository.ParticipantRepository;
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
            throw new IllegalArgumentException("Фамилия, инициалы не заданы");
        }

        if (participant.getPost() == null || participant.getPost().isEmpty()) {
            throw new IllegalArgumentException("Должность не задана");
        }

        return participantRepository.create(participant);
    }

    public Participant update(Participant participant) {

        if (participant.getInitials() == null || participant.getInitials().isEmpty()) {
            throw new IllegalArgumentException("Фамилия, инициалы не заданы");
        }

        if (participant.getPost() == null || participant.getPost().isEmpty()) {
            throw new IllegalArgumentException("Должность не задана");
        }

        return participantRepository.update(participant);
    }
}
