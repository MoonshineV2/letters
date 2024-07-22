package com.example.letters.controller;

import com.example.letters.model.Tag;
import com.example.letters.repository.TagRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("tags")
public class TagController {

    @Inject
    private TagRepository tagRepository;

    @GET
    @Produces("application/json")
    public List<Tag> getTags() {
        return tagRepository.findAll();
    }
}
