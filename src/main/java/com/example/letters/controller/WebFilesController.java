package com.example.letters.controller;

import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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

    /*@GET
    @Path("css/test.css")
    public InputStream getTestCssFile() {
        return servletContext.getResourceAsStream("/css/test.css");
    }

    @GET
    @Path("css/global.css")
    public InputStream getGlobalCssFile() {
        return servletContext.getResourceAsStream("/css/global.css");
    }

    @GET
    @Path("js/input.js")
    public Response getInputJSFile() {
        String filePath = servletContext.getRealPath("/js/input.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }

    @GET
    @Path("js/multiselect.js")
    public Response getMultiselectJSFile() {
        String filePath = servletContext.getRealPath("/js/multiselect.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }

    @GET
    @Path("js/modals.js")
    public Response getModalsJSFile() {
        String filePath = servletContext.getRealPath("/js/modals.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }

    @GET
    @Path("js/table.js")
    public Response getTableJSFile() {
        String filePath = servletContext.getRealPath("/js/table.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }

    @GET
    @Path("js/output.js")
    public Response getOutputJSFile() {
        String filePath = servletContext.getRealPath("/js/output.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }

    @GET
    @Path("js/search.js")
    public Response getSearchJSFile() {
        String filePath = servletContext.getRealPath("/js/search.js");
        File file = new File(filePath);
        InputStream in = null;
        try {
            in = new FileInputStream(file);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return Response.ok(in, MediaType.MULTIPART_FORM_DATA).build();
    }*/
}
