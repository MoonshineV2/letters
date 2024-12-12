package com.example.letters.repository;

import com.example.letters.model.Tag;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class TagRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<Tag> findAll() {
        return entityManager.createQuery("SELECT t FROM Tag t ORDER BY t.id ASC", Tag.class).getResultList();
    }

    public List<Tag> findAllActive() {
        return entityManager.createQuery("SELECT t FROM Tag t WHERE t.disabled = false ORDER BY t.id ASC", Tag.class).getResultList();
    }

    public Tag create (Tag tag) {
        entityManager.persist(tag);
        return tag;
    }

    public Tag update(Tag tag) {
        return entityManager.merge(tag);
    }
}
