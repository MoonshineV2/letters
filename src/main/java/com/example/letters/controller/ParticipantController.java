package com.example.letters.controller;

import com.example.letters.model.Participant;
import com.example.letters.repository.ParticipantRepository;
import com.example.letters.service.ParticipantService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("participants")
public class ParticipantController {

    @Inject
    private ParticipantService participantService;

    @GET
    @Produces("application/json")
    public List<Participant> getAll() {
        return participantService.findAll();
    }

    @GET
    @Path("signers")
    @Produces("application/json")
    public List<Participant> getSigners() {
        return participantService.findSigners();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public Response createParticipant(Participant participant) {
        Participant persisted = participantService.create(participant);

        return Response.ok(persisted).build();
    }
}
