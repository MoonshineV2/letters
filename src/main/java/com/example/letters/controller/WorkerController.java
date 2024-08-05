package com.example.letters.controller;

import com.example.letters.dto.WorkerDto;
import com.example.letters.model.Worker;
import com.example.letters.service.WorkerService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("workers")
public class WorkerController {
    @Inject
    private WorkerService workerService;

    @GET
    @Path("{id}")
    @Produces("application/json")
    public WorkerDto findWorker(@PathParam("id") Long id) {
        Worker worker = workerService.findById(id);

        return WorkerDto.fromWorker(worker);
    }

    @GET
    @Produces("application/json")
    public List<WorkerDto> getAll() {
        List<WorkerDto> workers = workerService.findAll().stream()
                .map(WorkerDto::fromWorker)
                .collect(Collectors.toList());

        return workers;
    }

    /*public Response createWorker(WorkerDto workerDto) {
        workerService.create(workerDto.);
    }*/
}