package com.example.letters.controller;

import com.example.letters.dto.ActualNumberIVC;
import com.example.letters.dto.OutputLetterDto;
import com.example.letters.model.OutputLetter;
import com.example.letters.service.OutputLetterService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("outputLetters")
public class OutputLetterController {

    @Inject
    private OutputLetterService outputLetterService;

    @GET
    @Path("{id}")
    @Produces("application/json")
    public OutputLetterDto find(@PathParam("id") int id) {
        OutputLetter outputLetter = outputLetterService.findById(id);
        return OutputLetterDto.fromOutputLetter(outputLetter);
    }

    @POST
    @Path("")
    @Consumes("application/json")
    public Response create(OutputLetter outputLetter) {
        outputLetterService.create(outputLetter);

        return Response.ok().build();
    }

    @GET
    @Path("actualNumberIVC")
    @Produces("application/json")
    public ActualNumberIVC getActualNumberIVC() {
        return new ActualNumberIVC(outputLetterService.getActualNumberIVC());
    }
}
