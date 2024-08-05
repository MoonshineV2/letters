package com.example.letters.controller;

import com.example.letters.model.Participant;
import com.example.letters.repository.ParticipantRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

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

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public Response createParticipant(Participant participant) {
        Participant persisted = participantRepository.create(participant);

        return Response.ok(persisted).build();
    }
}
