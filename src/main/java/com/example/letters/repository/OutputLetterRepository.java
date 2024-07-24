package com.example.letters.repository;

import com.example.letters.model.OutputLetter;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;

@Stateless
public class OutputLetterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<OutputLetter> findAll() {
        return entityManager.createQuery("SELECT ol FROM OutputLetter ol", OutputLetter.class).getResultList();
    }

    public Optional<OutputLetter> findById(int id) {
        return Optional.ofNullable(entityManager.find(OutputLetter.class, id));
    }
    public void create(OutputLetter outputLetter) {
        entityManager.persist(outputLetter);
    }
}
