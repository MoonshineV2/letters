package com.example.letters.controller;

import com.example.letters.dto.WorkerDto;
import com.example.letters.model.Participant;
import com.example.letters.model.Worker;
import com.example.letters.service.WorkerService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
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

    @GET
    @Path("signers")
    @Produces("application/json")
    public List<WorkerDto> getSigners() {
        return workerService.findSigners().stream()
                .map(WorkerDto::fromWorker)
                .collect(Collectors.toList());
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public Response createWorker(WorkerDto workerDto) {
        Worker worker = workerService.create(workerDto.toWorker());

        return Response.ok(worker).build();
    }
}