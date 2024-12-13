package com.example.letters.controller;

import com.example.letters.dto.*;
import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.service.InputLetterService;
import com.example.letters.util.DBFile;
import com.example.letters.util.FileNameEncoder;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.stream.Collectors;

@Path("inputLetters")
public class InputLetterController {

    @Inject
    private InputLetterService inputLetterService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<InputLetterDto> getAll() {
        List<InputLetter> inputLetters = inputLetterService.findAll();
        return inputLetters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }

    @GET
    @Path("{id}")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public InputLetterDto find(@PathParam("id") int id) {
        InputLetter inputLetter = inputLetterService.findById(id);
        return InputLetterDto.fromInputLetter(inputLetter);
    }

    @POST
    @Path("findByYears")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<InputLetterDto> getByYears(Years years) {
        List<InputLetter> letters = inputLetterService.findByYears(years.getYears());
        return letters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }

    @POST
    @Path("getByDates")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<InputLetterDto> getByDates(DatesFilter datesFilter) {
        List<InputLetter> letters = inputLetterService.findByDates(datesFilter.getYear(), datesFilter.getMonths());
        return letters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }

    @GET
    @Path("{id}/file")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response getFileByLetterId(@PathParam("id") int id) {
        DBFile dbFile = inputLetterService.getFileById(id);
        InputStream inputStream = new ByteArrayInputStream(dbFile.getFile());
        String contentDisposition;
        try {
            contentDisposition = "attachment;filename*=utf-8''" + FileNameEncoder.encodeFileName(dbFile.fileName);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        return Response.ok(inputStream, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", contentDisposition ) //optional
                .build();
    }

    @POST
    @Path("findByFilters")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<InputLetterDto> getByFilters(LetterFilters filters) {
        List<InputLetter> letters = inputLetterService.findByFilters(filters);
        return letters.stream()
                .map(InputLetterDto::fromInputLetter)
                .collect(Collectors.toList());
    }

    @POST
    @Path("")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public InputLetterDto create(InputLetterDto inputLetterDto) {
        InputLetter inputLetter = inputLetterService.create(inputLetterDto.toInputLetter());
        return InputLetterDto.fromInputLetter(inputLetter);
    }

    @GET
    @Path("actualNumberIVC")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public ActualNumberIVC getActualNumberIVC() {
        return new ActualNumberIVC(inputLetterService.getActualNumberIVC());
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public InputLetterDto update(InputLetterDto inputLetterDto) {
        InputLetter out = inputLetterService.update(inputLetterDto.toInputLetter());
        return InputLetterDto.fromInputLetter(out);
    }
}
