package com.example.letters.service;

import com.example.letters.model.Worker;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class WorkerService {

    public void findById(int id) {

        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("default");
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        entityManager.getTransaction().begin();
        Worker student = entityManager.find(Worker.class, id);

    }
}
