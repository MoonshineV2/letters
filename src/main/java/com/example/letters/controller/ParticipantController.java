package com.example.letters.controller;

import com.example.letters.dto.ParticipantDto;
import com.example.letters.model.Participant;
import com.example.letters.service.ParticipantService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

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
    @RolesAllowed({"letters_admin"})
    public ParticipantDto createParticipant(ParticipantDto participantDto) {
        Participant persisted = participantService.create(participantDto.toParticipant());

        return ParticipantDto.fromParticipant(persisted);
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
