package com.example.letters.controller;

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

@Path("pages")
public class PageController {

    @Context
    private ServletContext servletContext;

    @GET
    @Path("input")
    @Produces({MediaType.TEXT_HTML})
    public InputStream showInputPage() {
        return servletContext.getResourceAsStream("/html/inputPage.html");
    }

    @GET
    @Path("output")
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
    @Path("search")
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

}
