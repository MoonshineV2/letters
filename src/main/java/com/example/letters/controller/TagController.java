package com.example.letters.controller;

import com.example.letters.model.Tag;
import com.example.letters.service.TagService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import java.util.List;

@Path("tags")
public class TagController {

    @Inject
    private TagService tagService;

    @GET
    @Produces("application/json")
    public List<Tag> getTags() {
        return tagService.findAll();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public Tag create(Tag tag) {
        return tagService.create(tag);
    }
}
