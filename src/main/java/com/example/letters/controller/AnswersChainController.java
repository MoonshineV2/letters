package com.example.letters.controller;

import com.example.letters.service.AnswersChainService;
import com.example.letters.util.AnswersChain;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;

@Path("answers")
public class AnswersChainController {

    @Inject
    private AnswersChainService answersChainService;

    @GET
    @Path("inputLetter/{id}")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public AnswersChain getChainByInputLetterId(@PathParam("id") int id) {
        return answersChainService.getChainByInputLetterId(id);
    }

    @GET
    @Path("outputLetter/{id}")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public AnswersChain getChainByOutputLetterId(@PathParam("id") int id) {
        return answersChainService.getChainByOutputLetterId(id);
    }
}
