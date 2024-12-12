package com.example.letters.repository;

import com.example.letters.model.DocumentType;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class DocumentTypeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<DocumentType> findAll() {
        return entityManager.createQuery("SELECT dt FROM DocumentType dt ORDER BY dt.id ASC", DocumentType.class).getResultList();
    }

    public List<DocumentType> findAllActive() {
        return entityManager.createQuery("SELECT dt FROM DocumentType dt WHERE dt.disabled = false ORDER BY dt.id ASC", DocumentType.class).getResultList();
    }

    public DocumentType create(DocumentType dt) {
        entityManager.persist(dt);
        return dt;
    }

    public DocumentType update(DocumentType documentType) {
        return entityManager.merge(documentType);
    }
}
