package com.example.letters.controller;

import com.example.letters.model.Participant;
import com.example.letters.repository.ParticipantRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("participants")
public class ParticipantController {

    @Inject
    private ParticipantRepository participantRepository;

    @GET
    @Produces("application/json")
    public List<Participant> getAll() {
        return participantRepository.findAll();
    }

    @GET
    @Path("signers")
    @Produces("application/json")
    public List<Participant> getSigners() {
        return participantRepository.findSigners();
    }
}
