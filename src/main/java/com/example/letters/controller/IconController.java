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

@Path("icons")
public class IconController {

    @Context
    private ServletContext servletContext;

    @GET
    @Path("edit.svg")
    @Produces("image/svg+xml")
    public Response getEditSVGFile() {
        String filePath = servletContext.getRealPath("/icons/edit.svg");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in).build();
    }

    @GET
    @Path("gear.svg")
    @Produces("image/svg+xml")
    public Response getGearSVGFile() {
        String filePath = servletContext.getRealPath("/icons/gear.svg");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in).build();
    }
}
