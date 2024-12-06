package com.example.letters.controller;

import com.example.letters.dto.ParticipantDto;
import com.example.letters.model.Participant;
import com.example.letters.service.ParticipantService;
import jakarta.annotation.security.RolesAllowed;
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
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<Participant> getAll() {
        return participantService.findAll();
    }

    @GET
    @Path("signers")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<Participant> getSigners() {
        return participantService.findSigners();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response createParticipant(Participant participant) {
        Participant persisted = participantService.create(participant);

        return Response.ok(persisted).build();
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public ParticipantDto update(ParticipantDto participantDto) {
        Participant out = participantService.update(participantDto.toParticipant());
        return ParticipantDto.fromParticipant(out);
    }
}
