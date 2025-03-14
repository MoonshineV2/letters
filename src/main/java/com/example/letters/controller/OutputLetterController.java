package com.example.letters.controller;

import com.example.letters.dto.*;
import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.service.OutputLetterService;
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

@Path("api/outputLetters")
public class OutputLetterController {

    @Inject
    private OutputLetterService outputLetterService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OutputLetterDto> getAll() {
        List<OutputLetter> inputLetters = outputLetterService.findAll();
        return inputLetters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }
    @GET
    @Path("{id}")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public OutputLetterDto find(@PathParam("id") int id) {
        OutputLetter outputLetter = outputLetterService.findById(id);
        return OutputLetterDto.fromOutputLetter(outputLetter);
    }

    @POST
    @Path("findByYears")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OutputLetterDto> getByYears(Years years) {
        List<OutputLetter> letters = outputLetterService.findByYears(years.getYears());
        return letters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }

    @POST
    @Path("getByDates")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OutputLetterDto> getByDates(DatesFilter datesFilter) {
        List<OutputLetter> letters = outputLetterService.findByDates(datesFilter.getYear(), datesFilter.getMonths());
        return letters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }

    @GET
    @Path("{id}/file")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response getFileByLetterId(@PathParam("id") int id) {
        DBFile dbFile = outputLetterService.getFileById(id);
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
    @Path("")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public OutputLetterDto create(OutputLetterDto outputLetterDto) {
        OutputLetter outputLetter = outputLetterService.create(outputLetterDto.toOutputLetter());

        return OutputLetterDto.fromOutputLetter(outputLetter);
    }

    @POST
    @Path("findByFilters")
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OutputLetterDto> getByFilters(LetterFilters filters) {
        List<OutputLetter> letters = outputLetterService.findByFilters(filters);
        return letters.stream()
                .map(OutputLetterDto::fromOutputLetter)
                .collect(Collectors.toList());
    }

    @GET
    @Path("actualNumberIVC")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public ActualNumberIVC getActualNumberIVC() {
        return new ActualNumberIVC(outputLetterService.getActualNumberIVC());
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public OutputLetterDto update(OutputLetterDto outputLetterDto) {
        OutputLetter out = outputLetterService.update(outputLetterDto.toOutputLetter());
        return OutputLetterDto.fromOutputLetter(out);
    }
}
