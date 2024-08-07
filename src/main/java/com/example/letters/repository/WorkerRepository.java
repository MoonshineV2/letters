package com.example.letters.repository;

import com.example.letters.model.InputLetter;
import com.example.letters.model.Tag;
import com.example.letters.model.Worker;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;

@Stateless
public class WorkerRepository {

    @PersistenceContext
    private EntityManager entityManager;
    public List<Worker> findAll() {
        return entityManager.createQuery("SELECT w FROM Worker w", Worker.class).getResultList();
    }
    public Optional<Worker> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Worker.class, id));
    }

    public Worker create(Worker worker) {
        entityManager.persist(worker);

        return worker;
    }
}
