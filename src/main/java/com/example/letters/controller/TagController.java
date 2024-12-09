package com.example.letters.controller;

import com.example.letters.model.Tag;
import com.example.letters.service.TagService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import java.util.List;

@Path("tags")
public class TagController {

    @Inject
    private TagService tagService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<Tag> getTags() {
        return tagService.findAll();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public Tag create(Tag tag) {
        return tagService.create(tag);
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public Tag update(Tag tag) {
        Tag out = tagService.update(tag);
        return out;
    }
}
