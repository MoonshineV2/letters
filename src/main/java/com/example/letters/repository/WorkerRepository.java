package com.example.letters.repository;

import com.example.letters.model.*;
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
        return entityManager.createQuery("SELECT w FROM Worker w ORDER BY w.id ASC", Worker.class).getResultList();
    }

    public List<Worker> findAllActive() {
        return entityManager.createQuery("SELECT w FROM Worker w WHERE w.disabled = false ORDER BY w.id ASC", Worker.class).getResultList();
    }

    public Optional<Worker> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Worker.class, id));
    }

    public List<Worker> findSigners() {
        return entityManager.createQuery("SELECT w FROM Worker w WHERE w.canSign = true AND w.disabled = false ORDER BY w.id ASC", Worker.class).getResultList();
    }

    public Worker create(Worker worker) {
        entityManager.persist(worker);
        return worker;
    }

    public Worker update(Worker worker) {
        return entityManager.merge(worker);
    }
}
