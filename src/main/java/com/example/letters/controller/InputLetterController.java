package com.example.letters.controller;

import com.example.letters.dto.ActualNumberIVC;
import com.example.letters.dto.InputLetterDto;
import com.example.letters.dto.Years;
import com.example.letters.model.InputLetter;
import com.example.letters.service.InputLetterService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("inputLetters")
public class InputLetterController {

    @Inject
    private InputLetterService inputLetterService;

    @GET
    @Produces("application/json")
    public List<InputLetterDto> getAll() {
        List<InputLetter> inputLetters = inputLetterService.findAll();
        return inputLetters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }
    @GET
    @Path("{id}")
    @Produces("application/json")
    public InputLetterDto find(@PathParam("id") int id) {
        InputLetter inputLetter = inputLetterService.findById(id);
        return InputLetterDto.fromInputLetter(inputLetter);
    }

    @POST
    @Path("findByYears")
    @Consumes("application/json")
    @Produces("application/json")
    public List<InputLetterDto> getByYears(Years years) {
        List<InputLetter> letters = inputLetterService.findByYears(years.getYears());
        return letters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }
    @POST
    @Path("")
    @Consumes("application/json")
    public Response create(InputLetterDto inputLetterDto) {
        inputLetterService.create(inputLetterDto.toInputLetter());

        return Response.ok().build();
    }

    @GET
    @Path("actualNumberIVC")
    @Produces("application/json")
    public ActualNumberIVC getActualNumberIVC() {
        return new ActualNumberIVC(inputLetterService.getActualNumberIVC());
    }
}
