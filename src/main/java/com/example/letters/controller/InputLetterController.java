package com.example.letters.controller;

import com.example.letters.model.InputLetter;
import com.example.letters.repository.InputLetterRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("inputLetters")
public class InputLetterController {

    @Inject
    private InputLetterRepository inputLetterRepository;

    @GET
    @Path("{id}")
    @Produces("application/json")
    public InputLetter find(@PathParam("id") int id) {
        InputLetter inputLetter = inputLetterRepository.findById(id)
                .orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));

        return inputLetter;
    }

    @POST
    @Path("")
    public Response create(InputLetter inputLetter) {
        inputLetterRepository.create(inputLetter);

        return Response.ok().build();
    }
}
