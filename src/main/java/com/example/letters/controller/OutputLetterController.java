package com.example.letters.controller;

import com.example.letters.dto.ActualNumberIVC;
import com.example.letters.dto.OutputLetterDto;
import com.example.letters.dto.Years;
import com.example.letters.model.OutputLetter;
import com.example.letters.service.OutputLetterService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("outputLetters")
public class OutputLetterController {

    @Inject
    private OutputLetterService outputLetterService;

    @GET
    @Produces("application/json")
    public List<OutputLetterDto> getAll() {
        List<OutputLetter> inputLetters = outputLetterService.findAll();
        return inputLetters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }
    @GET
    @Path("{id}")
    @Produces("application/json")
    public OutputLetterDto find(@PathParam("id") int id) {
        OutputLetter outputLetter = outputLetterService.findById(id);
        return OutputLetterDto.fromOutputLetter(outputLetter);
    }

    @POST
    @Path("findByYears")
    @Consumes("application/json")
    @Produces("application/json")
    public List<OutputLetterDto> getByYears(Years years) {
        List<OutputLetter> letters = outputLetterService.findByYears(years.getYears());
        return letters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }

    @POST
    @Path("")
    @Consumes("application/json")
    public Response create(OutputLetterDto outputLetterDto) {
        outputLetterService.create(outputLetterDto.toOutputLetter());

        return Response.ok().build();
    }

    @GET
    @Path("actualNumberIVC")
    @Produces("application/json")
    public ActualNumberIVC getActualNumberIVC() {
        return new ActualNumberIVC(outputLetterService.getActualNumberIVC());
    }
}
