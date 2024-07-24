package com.example.letters.controller;

import jakarta.servlet.ServletContext;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
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
    public Response showInputPage() {
        String filePath = servletContext.getRealPath("/html/inputPage.html");
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
    @Path("letters.css")
    public Response getCssFile() {
        String filePath = servletContext.getRealPath("/css/letters.css");
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
    @Path("input.js")
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
    @Path("output.js")
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
}
