package com.example.letters.repository;

import com.example.letters.model.Worker;
import com.example.letters.util.JPAUtil;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceContext;

import java.util.Optional;

@Stateless
public class WorkerRepository {

    @PersistenceContext
    private EntityManager entityManager;
    public Optional<Worker> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Worker.class, id));
    }
}
