package com.example.letters.controller;

import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Context;

import java.io.InputStream;

@Path("")
public class WebFilesController {

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
    @Path("icons/{path}")
    public InputStream getIconFile(@PathParam("path") String path) {
        System.out.println("работает");
        System.out.println(path);
        return servletContext.getResourceAsStream("/icons/" + path);
    }
}
