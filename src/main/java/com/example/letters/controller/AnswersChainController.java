package com.example.letters.controller;

import com.example.letters.model.InputLetter;
import com.example.letters.service.AnswersChainService;
import com.example.letters.util.AnswersChain;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Path("answers")
public class AnswersChainController {

    @Inject
    private AnswersChainService answersChainService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public AnswersChain test() {
        return answersChainService.getChain(new InputLetter(1));
    }
}
