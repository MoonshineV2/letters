package com.example.letters.service;

import com.example.letters.model.DocumentType;
import com.example.letters.repository.DocumentTypeRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;

@Model
public class DocumentTypeService {

    @Inject
    private DocumentTypeRepository documentTypeRepository;

    public List<DocumentType> findAll() {
        return documentTypeRepository.findAll();
    }

    public DocumentType create(DocumentType documentType) {

        if (documentType.getName() == null || documentType.getName().isEmpty()) {
            throw new IllegalArgumentException("Название типа документа не задано");
        }

        return documentTypeRepository.create(documentType);
    }

    public DocumentType update(DocumentType documentType) {

        if (documentType.getName() == null || documentType.getName().isEmpty()) {
            throw new IllegalArgumentException("Название типа документа не задано");
        }

        return documentTypeRepository.update(documentType);
    }
}
