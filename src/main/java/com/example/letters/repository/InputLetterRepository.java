package com.example.letters.repository;

import com.example.letters.model.InputLetter;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.Optional;

@Stateless
public class InputLetterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Optional<InputLetter> findById(int id) {
        return Optional.ofNullable(entityManager.find(InputLetter.class, id));
    }
    public void create(InputLetter inputLetter) {
        entityManager.persist(inputLetter);
    }
}
