package com.example.letters.controller;

import com.example.letters.model.DocumentType;
import com.example.letters.repository.DocumentTypeRepository;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("documentTypes")
public class DocumentTypeController {

    @Inject
    private DocumentTypeRepository documentTypeRepository;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<DocumentType> getAll() {
        return documentTypeRepository.findAll();
    }
}
