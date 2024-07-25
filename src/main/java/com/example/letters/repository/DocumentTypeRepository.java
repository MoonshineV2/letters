package com.example.letters.repository;

import com.example.letters.model.DocumentType;
import com.example.letters.model.InputLetter;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class DocumentTypeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<DocumentType> findAll() {
        return entityManager.createQuery("SELECT dt FROM DocumentType dt", DocumentType.class).getResultList();
    }
}
