package com.example.letters.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@Path("")
public class PageController {

    @Context
    private ServletContext servletContext;

    @GET
    @Path("")
    @Produces({MediaType.TEXT_HTML})
    @RolesAllowed({"letters_default", "letters_admin"})
    public InputStream showWelcomePage() {
        return servletContext.getResourceAsStream("/html/welcomePage.html");
    }

    @GET
    @Path("pages/input")
    @Produces({MediaType.TEXT_HTML})
    @RolesAllowed({"letters_default", "letters_admin"})
    public InputStream showInputPage() {
        return servletContext.getResourceAsStream("/html/inputPage.html");
    }

    @GET
    @Path("pages/output")
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response showOutputPage() {
        String filePath = servletContext.getRealPath("/html/outputPage.html");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.TEXT_HTML).build();
    }

    @GET
    @Path("pages/search")
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response showSearchPage() {
        String filePath = servletContext.getRealPath("/html/searchPage.html");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.TEXT_HTML).build();
    }

    @GET
    @Path("pages/administrating")
    @RolesAllowed({"letters_admin"})
    public Response showAdministratingPage() {
        String filePath = servletContext.getRealPath("/html/administratingPage.html");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.TEXT_HTML).build();
    }

    @GET
    @Path("pages/answers")
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response showAnswersPage() {
        String filePath = servletContext.getRealPath("/html/answersPage.html");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.TEXT_HTML).build();
    }
}
