package com.example.letters.controller;

import com.example.letters.dto.DocumentTypeDto;
import com.example.letters.util.EmailSender;
import jakarta.annotation.security.RolesAllowed;
import jakarta.mail.Session;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

@Path("emailSender")
public class EmailSenderController {

    @GET
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response getAllActive() {

        EmailSender.sendEmail("KornilovAA@gvc.rzd");

        return Response.ok().build();
    }
}
