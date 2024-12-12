package com.example.letters.service;

import com.example.letters.model.Worker;
import com.example.letters.model.Workgroup;
import com.example.letters.repository.WorkerRepository;
import com.example.letters.repository.WorkgroupRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Model
public class WorkerService {

    @Inject
    private WorkerRepository workerRepository;
    @Inject
    private WorkgroupRepository workgroupRepository;

    public List<Worker> findAll() {
        return workerRepository.findAll();
    }
    public List<Worker> findAllActive() {
        return workerRepository.findAllActive();
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
            throw new IllegalArgumentException("Фамилия, инициалы не заданы");
        }

        if (worker.getPost() == null || worker.getPost().isEmpty()) {
            throw new IllegalArgumentException("Должность не задана");
        }

        if (worker.getWorkgroup() != null) {
            Workgroup workgroup = workgroupRepository.findById(worker.getWorkgroup().getId());
            worker.setWorkgroup(workgroup);
        }

        return workerRepository.create(worker);
    }

    public Worker update(Worker worker) {

        if (worker.getInitials() == null || worker.getInitials().isEmpty()) {
            throw new IllegalArgumentException("Фамилия, инициалы не заданы");
        }

        if (worker.getPost() == null || worker.getPost().isEmpty()) {
            throw new IllegalArgumentException("Должность не задана");
        }

        if (worker.getWorkgroup() != null) {
            Workgroup workgroup = workgroupRepository.findById(worker.getWorkgroup().getId());
            worker.setWorkgroup(workgroup);
        }

        return workerRepository.update(worker);
    }

}
