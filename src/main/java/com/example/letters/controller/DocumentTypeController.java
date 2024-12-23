package com.example.letters.controller;

import com.example.letters.dto.DocumentTypeDto;
import com.example.letters.model.DocumentType;
import com.example.letters.service.DocumentTypeService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import java.util.List;
import java.util.stream.Collectors;

@Path("documentTypes")
public class DocumentTypeController {

    @Inject
    private DocumentTypeService documentTypeService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<DocumentTypeDto> getAllActive() {
        return documentTypeService.findAllActive()
                .stream()
                .map(DocumentTypeDto::fromDocumentType)
                .collect(Collectors.toList());
    }

    @GET
    @Path("withDisabled")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<DocumentTypeDto> getAll() {
        return documentTypeService.findAll()
                .stream()
                .map(DocumentTypeDto::fromDocumentType)
                .collect(Collectors.toList());
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public DocumentTypeDto create(DocumentType documentType) {
        DocumentType dt = documentTypeService.create(documentType);
        return DocumentTypeDto.fromDocumentType(dt);
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public DocumentTypeDto update(DocumentTypeDto documentTypeDto) {
        DocumentType out = documentTypeService.update(documentTypeDto.toDocumentType());
        return DocumentTypeDto.fromDocumentType(out);
    }
}
