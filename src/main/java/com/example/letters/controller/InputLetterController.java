package com.example.letters.controller;

import com.example.letters.dto.ActualNumberIVC;
import com.example.letters.dto.InputLetterDto;
import com.example.letters.dto.Years;
import com.example.letters.model.InputLetter;
import com.example.letters.service.InputLetterService;
import com.example.letters.util.DBFile;
import com.example.letters.util.FileNameEncoder;
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

    @GET
    @Path("{id}/file")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
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

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    public InputLetterDto update(InputLetterDto inputLetterDto) {
        InputLetter out = inputLetterService.update(inputLetterDto.toInputLetter());
        return InputLetterDto.fromInputLetter(out);
    }
}
