package com.example.letters.service;

import com.example.letters.model.Worker;
import com.example.letters.repository.WorkerRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Model
public class WorkerService {

    @Inject
    private WorkerRepository workerRepository;

    public List<Worker> findAll() {
        return workerRepository.findAll();
    }

    public Worker findById(long id) {
         return workerRepository.findById(id)
                .orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));
    }

    public List<Worker> findSigners() {
        return workerRepository.findSigners();
    }

    public Worker create(Worker worker) {

        if (worker.getInitials() == null || worker.getInitials().isEmpty()) {
            throw new RuntimeException("Фамилия, инициалы не заданы");
        }

        if (worker.getPost() == null || worker.getPost().isEmpty()) {
            throw new RuntimeException("Должность не задана");
        }

        return workerRepository.create(worker);
    }

}
