package com.example.letters.controller;

import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@Path("")
public class WebContentController {

    @Context
    private ServletContext servletContext;
    @GET
    @Path("css/{path}")
    public InputStream getCssFile(@PathParam("path") String path) {
        return servletContext.getResourceAsStream("/css/" + path);
    }

    @GET
    @Path("js/{path}")
    public InputStream getJsFile(@PathParam("path") String path) {
        return servletContext.getResourceAsStream("/js/" + path);
    }

    @GET
    @Path("fonts/{path}")
    public InputStream getFontFile(@PathParam("path") String path) {
        return servletContext.getResourceAsStream("/fonts/" + path);
    }
    @GET
    @Path("images/{filename}")
    @Produces("image/svg+xml")
    public Response getSVGFile(@PathParam("filename") String filename) {
        String filePath = servletContext.getRealPath("/images/" + filename);
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
